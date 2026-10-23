import uuid
from datetime import datetime
from app.models import db

class Plan(db.Model):
    __tablename__ = "plans"

    id = db.Column(db.String(64), primary_key=True, default=lambda: f"plan_{uuid.uuid4().hex[:12]}")
    session_id = db.Column(db.String(64), nullable=True, index=True)
    title = db.Column(db.String(255), nullable=False)
    objective = db.Column(db.Text, nullable=True)
    summary = db.Column(db.Text, nullable=True)
    target_date = db.Column(db.String(100), nullable=True)
    status = db.Column(db.String(50), default="saved", nullable=False) # "draft" or "saved"
    daily_capacity_minutes = db.Column(db.Integer, default=60, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    tasks = db.relationship(
        "Task",
        backref="plan",
        lazy=True,
        cascade="all, delete-orphan",
        order_by="Task.position"
    )

    @property
    def completion_percentage(self) -> int:
        if not self.tasks:
            return 0
        completed = sum(1 for t in self.tasks if t.done)
        return int((completed / len(self.tasks)) * 100)

    @property
    def minutes_total(self) -> int:
        return sum(t.minutes for t in self.tasks if t.minutes)

    def to_dict(self, include_tasks: bool = True) -> dict:
        data = {
            "id": self.id,
            "title": self.title,
            "objective": self.objective or self.summary or "",
            "summary": self.summary or self.objective or "",
            "target_date": self.target_date,
            "status": self.status,
            "dailyCapacityMinutes": self.daily_capacity_minutes or 60,
            "completionPercentage": self.completion_percentage,
            "progress_percentage": self.completion_percentage,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
            "task_count": len(self.tasks),
            "done_count": sum(1 for t in self.tasks if t.done),
            "minutes_total": self.minutes_total,
            "total_tasks": len(self.tasks),
            "completed_tasks": sum(1 for t in self.tasks if t.done)
        }
        if include_tasks:
            data["tasks"] = [t.to_dict() for t in self.tasks]
        return data

    def to_summary(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "task_count": len(self.tasks),
            "done_count": sum(1 for t in self.tasks if t.done),
            "minutes_total": self.minutes_total,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
