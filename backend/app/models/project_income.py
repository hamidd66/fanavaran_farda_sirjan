from sqlalchemy import Column, Integer, String, Text
from app.db.base import Base


class ProjectIncome(Base):
    __tablename__ = "project_incomes"

    id = Column(Integer, primary_key=True, index=True)
    project_title = Column(String(200), nullable=False)
    amount = Column(Integer, nullable=False)
    account = Column(String(100), nullable=False)
    income_date = Column(String(10), nullable=False)
    payment_method = Column(String(50), nullable=False)
    payer_name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    recorded_by = Column(String(100), nullable=False)
    record_date = Column(String(10), nullable=False)
