from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from app.models.plan import Plan
from app.models.task import Task
from app.models.action import ProposedAction

__all__ = ["db", "Plan", "Task", "ProposedAction"]
