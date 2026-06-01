from fastapi import APIRouter

from app.api.deps import DbSession
from app.schemas.dashboard import DashboardSummary
from app.services.dashboard import get_dashboard_summary

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("", response_model=DashboardSummary)
def dashboard_summary(db: DbSession):
    return get_dashboard_summary(db)
