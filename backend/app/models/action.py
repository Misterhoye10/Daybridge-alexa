import uuid
from datetime import datetime, timedelta
import json
from app.models import db

class ProposedAction(db.Model):
    __tablename__ = "proposed_actions"

    id = db.Column(db.String(64), primary_key=True, default=lambda: f"act_{uuid.uuid4().hex[:12]}")
    session_id = db.Column(db.String(64), nullable=True, index=True)
    plan_id = db.Column(db.String(64), nullable=True)
    kind = db.Column(db.String(50), default="update_plan", nullable=False)
    title = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(50), default="awaiting_confirmation", nullable=False)
    changes_json = db.Column(db.Text, default="[]", nullable=False)
    payload_json = db.Column(db.Text, default="{}", nullable=False)
    summary = db.Column(db.Text, nullable=True)
    expires_at = db.Column(db.DateTime, default=lambda: datetime.utcnow() + timedelta(minutes=15), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    @property
    def changes(self):
        try:
            return json.loads(self.changes_json)
        except Exception:
            return []

    @changes.setter
    def changes(self, val):
        self.changes_json = json.dumps(val)

    @property
    def payload(self):
        try:
            return json.loads(self.payload_json)
        except Exception:
            return {}

    @payload.setter
    def payload(self, val):
        self.payload_json = json.dumps(val)

    def to_dict(self):
        return {
            "id": self.id,
            "kind": self.kind,
            "type": self.kind,
            "plan_id": self.plan_id,
            "title": self.title,
            "label": self.title,
            "status": self.status,
            "state": self.status,
            "changes": self.changes,
            "summary": self.summary,
            "expires_at": self.expires_at.isoformat() if self.expires_at else None
        }
