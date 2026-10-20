from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class TaskCreateSchema(BaseModel):
    title: str = Field(..., description="Title or concise action name")
    description: Optional[str] = Field(default="", description="Detailed instructions or context")
    priority: Optional[str] = Field(default="medium", description="Priority: low, medium, or high")
    due_date: Optional[str] = Field(default=None, description="Due date or target day (e.g., 'Monday', '2026-10-24')")
    estimated_minutes: Optional[int] = Field(default=30, description="Estimated time required in minutes")
    order: Optional[int] = Field(default=1, description="Sort order / sequence of task")

class TaskUpdateSchema(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[str] = None
    estimated_minutes: Optional[int] = None
    is_completed: Optional[bool] = None
    order: Optional[int] = None

class PlanCreateSchema(BaseModel):
    title: str = Field(..., description="Plan title (e.g. 'Software Engineering Interview Prep')")
    summary: Optional[str] = Field(default="", description="Overview of the plan goal and constraints")
    target_date: Optional[str] = Field(default=None, description="Target completion date or deadline")
    tasks: Optional[List[TaskCreateSchema]] = Field(default=[], description="List of structured actionable tasks")

class PlanUpdateSchema(BaseModel):
    title: Optional[str] = None
    summary: Optional[str] = None
    target_date: Optional[str] = None
    status: Optional[str] = None

class ChatRequestSchema(BaseModel):
    message: str = Field(..., min_length=1, description="User's input query or command")
    conversation_history: Optional[List[Dict[str, Any]]] = Field(default=[], description="Past conversation messages")
    active_plan_id: Optional[str] = Field(default=None, description="ID of currently selected or open plan")
