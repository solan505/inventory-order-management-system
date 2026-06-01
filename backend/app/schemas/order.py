from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.schemas.customer import CustomerSummary
from app.schemas.shared import MoneyModel


class OrderItemCreate(BaseModel):
    product_id: int = Field(..., gt=0)
    quantity: int = Field(..., gt=0)


class OrderCreate(BaseModel):
    customer_id: int = Field(..., gt=0)
    items: list[OrderItemCreate] = Field(..., min_length=1)

    @field_validator("items")
    @classmethod
    def require_items(cls, value: list[OrderItemCreate]) -> list[OrderItemCreate]:
        if not value:
            raise ValueError("Order must include at least one product")
        return value


class OrderItemResponse(MoneyModel):
    id: int
    product_id: int | None
    product_name: str
    product_sku: str
    unit_price: Decimal
    quantity: int
    line_total: Decimal

    model_config = ConfigDict(from_attributes=True)


class OrderResponse(MoneyModel):
    id: int
    customer_id: int
    customer: CustomerSummary
    items: list[OrderItemResponse]
    total_amount: Decimal
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
