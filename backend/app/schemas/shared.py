from decimal import Decimal

from pydantic import BaseModel, field_serializer


class MoneyModel(BaseModel):
    @field_serializer(
        "price",
        "unit_price",
        "line_total",
        "total_amount",
        check_fields=False,
        when_used="json",
    )
    def serialize_decimal(self, value: Decimal):
        return float(value)
