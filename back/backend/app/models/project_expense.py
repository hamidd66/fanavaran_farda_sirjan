from sqlalchemy import Column, Integer, String, Text
from app.core.database import Base


class ProjectExpense(Base):
    __tablename__ = "project_expenses"

    id = Column(Integer, primary_key=True, index=True)
    project_title = Column(String(200), nullable=False)
    recipient_name = Column(String(100), nullable=False)
    total_wage = Column(Integer, nullable=False)
    paid_amount = Column(Integer, nullable=False)
    account = Column(String(100), nullable=False)
    payment_date = Column(String(10), nullable=False)
    payment_method = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    recorded_by = Column(String(100), nullable=False)
    record_date = Column(String(10), nullable=False)
