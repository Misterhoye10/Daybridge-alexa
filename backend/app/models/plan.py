import uuid
from datetime import datetime
from app.models import db

class Plan(db.Model):
    __tablename__ = "plans"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(255), nullable=False)
    summary = db.Column(db.Text, nullable=True)
    target_date = db.Column(db.String(100), nullable=True)
    status = db.Column(db.String(50), default="active", nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    tasks = db.relationship(
        "Task",
        backref="plan",
        lazy=True,
        cascade="all, delete-orphan",
        order_by="Task.order"
    )

    @property
    def progress_percentage(self) -> int:
        if not self.tasks:
            return 0
        completed = sum(1 for t in self.tasks if t.is_completed)
        return int((completed / len(self.tasks)) * 100)

    def to_dict(self, include_tasks: bool = True) -> dict:
        data = {
            "id": self.id,
            "title": self.title,
            "summary": self.summary,
            "target_date": self.target_date,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "progress_percentage": self.progress_percentage,
            "total_tasks": len(self.tasks),
            "completed_tasks": sum(1 for t in self.tasks if t.is_completed)
        }
        if include_tasks:
            data["tasks"] = [t.to_dict() for t in self.tasks]
        return data
