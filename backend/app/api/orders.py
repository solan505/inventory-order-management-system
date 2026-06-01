from fastapi import APIRouter, HTTPException, status

from app.api.deps import DbSession
from app.schemas.order import OrderCreate, OrderResponse
from app.services import orders as order_service

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(order_in: OrderCreate, db: DbSession):
    try:
        return order_service.create_order(db, order_in)
    except LookupError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc


@router.get("", response_model=list[OrderResponse])
def list_orders(db: DbSession):
    return order_service.list_orders(db)


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: DbSession):
    order = order_service.get_order(db, order_id)
    if order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(order_id: int, db: DbSession):
    order = order_service.get_order(db, order_id)
    if order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    order_service.delete_order(db, order)
