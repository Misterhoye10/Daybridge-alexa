import uuid
from datetime import datetime
from app.models import db

class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.String(64), primary_key=True, default=lambda: f"task_{uuid.uuid4().hex[:12]}")
    plan_id = db.Column(db.String(64), db.ForeignKey("plans.id"), nullable=False, index=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True, default="")
    day = db.Column(db.String(100), nullable=True) # e.g. "Monday (1 hr)" or "2026-10-26"
    minutes = db.Column(db.Integer, default=30, nullable=False)
    priority = db.Column(db.String(20), default="medium", nullable=False)
    done = db.Column(db.Boolean, default=False, nullable=False)
    position = db.Column(db.Float, default=0.0, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "plan_id": self.plan_id,
            "planId": self.plan_id,
            "title": self.title,
            "description": self.description or "",
            "day": self.day,
            "due_date": self.day,
            "dueDate": self.day,
            "minutes": self.minutes,
            "estimated_minutes": self.minutes,
            "estimatedMinutes": self.minutes,
            "priority": self.priority,
            "done": self.done,
            "is_completed": self.done,
            "isCompleted": self.done,
            "position": self.position,
            "order": int(self.position) if self.position is not None else 1,
            "orderIndex": int(self.position) if self.position is not None else 1,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
