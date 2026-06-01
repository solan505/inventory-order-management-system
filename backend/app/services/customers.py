from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.models.order import Order
from app.schemas.customer import CustomerCreate


def list_customers(db: Session) -> list[Customer]:
    return list(db.scalars(select(Customer).order_by(Customer.id)).all())


def get_customer(db: Session, customer_id: int) -> Customer | None:
    return db.get(Customer, customer_id)


def create_customer(db: Session, customer_in: CustomerCreate) -> Customer:
    customer = Customer(**customer_in.model_dump())
    db.add(customer)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise ValueError("Customer email already exists") from exc
    db.refresh(customer)
    return customer


def delete_customer(db: Session, customer: Customer) -> None:
    order_count = db.scalar(
        select(func.count(Order.id)).where(Order.customer_id == customer.id)
    )
    if order_count:
        raise ValueError("Customer cannot be deleted while orders exist")

    db.delete(customer)
    db.commit()
