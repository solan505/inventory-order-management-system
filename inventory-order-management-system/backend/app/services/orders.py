from collections import defaultdict
from decimal import Decimal, ROUND_HALF_UP

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload, selectinload

from app.models.customer import Customer
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate


def _money(value: Decimal) -> Decimal:
    return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def list_orders(db: Session) -> list[Order]:
    return list(
        db.scalars(
            select(Order)
            .options(joinedload(Order.customer), selectinload(Order.items))
            .order_by(Order.id.desc())
        )
        .unique()
        .all()
    )


def get_order(db: Session, order_id: int) -> Order | None:
    return db.scalars(
        select(Order)
        .where(Order.id == order_id)
        .options(joinedload(Order.customer), selectinload(Order.items))
    ).first()


def create_order(db: Session, order_in: OrderCreate) -> Order:
    customer = db.get(Customer, order_in.customer_id)
    if customer is None:
        raise LookupError("Customer not found")

    requested_quantities: dict[int, int] = defaultdict(int)
    for item in order_in.items:
        requested_quantities[item.product_id] += item.quantity

    products = list(
        db.scalars(
            select(Product)
            .where(Product.id.in_(requested_quantities.keys()))
            .with_for_update()
        ).all()
    )
    products_by_id = {product.id: product for product in products}

    missing_product_ids = [
        product_id
        for product_id in requested_quantities
        if product_id not in products_by_id
    ]
    if missing_product_ids:
        missing = ", ".join(str(product_id) for product_id in missing_product_ids)
        raise LookupError(f"Product not found: {missing}")

    for product_id, quantity in requested_quantities.items():
        product = products_by_id[product_id]
        if product.quantity_in_stock < quantity:
            raise ValueError(
                f"Insufficient stock for SKU {product.sku}. "
                f"Available: {product.quantity_in_stock}, requested: {quantity}"
            )

    order = Order(customer_id=customer.id, total_amount=Decimal("0.00"))
    total = Decimal("0.00")

    for product_id, quantity in requested_quantities.items():
        product = products_by_id[product_id]
        unit_price = _money(product.price)
        line_total = _money(unit_price * quantity)
        product.quantity_in_stock -= quantity
        total += line_total
        order.items.append(
            OrderItem(
                product_id=product.id,
                product_name=product.name,
                product_sku=product.sku,
                unit_price=unit_price,
                quantity=quantity,
                line_total=line_total,
            )
        )

    order.total_amount = _money(total)
    db.add(order)
    db.commit()
    return get_order(db, order.id) or order


def delete_order(db: Session, order: Order) -> None:
    for item in order.items:
        if item.product_id is None:
            continue
        product = db.scalars(
            select(Product).where(Product.id == item.product_id).with_for_update()
        ).first()
        if product is not None:
            product.quantity_in_stock += item.quantity

    db.delete(order)
    db.commit()
