import React, { useState } from 'react';
import type { Task, TaskPriority } from '../../types/daybridge';
import {
  Check,
  Clock,
  Edit2,
  Trash2,
  Save,
  X,
  ChevronDown,
  ChevronRight,
  Plus,
  Flag,
  Layers,
  AlertCircle,
  ArrowRightLeft
} from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onUpdateTask?: (updated: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  isSuggested?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onUpdateTask,
  onDeleteTask,
  isSuggested = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || '');
  const [editedPriority, setEditedPriority] = useState<TaskPriority>(task.priority || 'medium');
  const [editedMinutes, setEditedMinutes] = useState(task.estimatedMinutes || task.minutes || 30);

  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter((s) => s.isCompleted || s.done).length;
  const isCompleted = Boolean(task.isCompleted || task.done);
  const minutes = task.estimatedMinutes || task.minutes || 0;

  const handleSave = () => {
    if (onUpdateTask) {
      onUpdateTask({
        ...task,
        title: editedTitle.trim() || task.title,
        description: editedDescription.trim(),
        priority: editedPriority,
        estimatedMinutes: editedMinutes,
        minutes: editedMinutes
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setEditedDescription(task.description || '');
    setEditedPriority(task.priority || 'medium');
    setEditedMinutes(task.estimatedMinutes || task.minutes || 30);
    setIsEditing(false);
  };

  const handleToggleSubtask = (subtaskId: string) => {
    if (!onUpdateTask) return;
    const updatedSubtasks = subtasks.map((s) =>
      s.id === subtaskId ? { ...s, isCompleted: !s.isCompleted, done: !s.isCompleted } : s
    );
    onUpdateTask({
      ...task,
      subtasks: updatedSubtasks
    });
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim() || !onUpdateTask) return;
    const newSub: Task = {
      id: `sub-${Date.now()}`,
      parentId: task.id,
      title: newSubtaskTitle.trim(),
      description: '',
      day: task.day,
      minutes: 15,
      estimatedMinutes: 15,
      priority: task.priority || 'medium',
      done: false,
      isCompleted: false,
      position: subtasks.length,
      orderIndex: subtasks.length
    };

    onUpdateTask({
      ...task,
      subtasks: [...subtasks, newSub]
    });
    setNewSubtaskTitle('');
    setIsAddingSubtask(false);
    setShowSubtasks(true);
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    if (!onUpdateTask) return;
    onUpdateTask({
      ...task,
      subtasks: subtasks.filter((s) => s.id !== subtaskId)
    });
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '12px 14px',
        backgroundColor: isCompleted
          ? 'transparent'
          : isHovered
          ? 'var(--color-bg-sunken)'
          : 'var(--color-bg-surface)',
        border: `1px solid ${
          isSuggested
            ? 'var(--color-action-primary)'
            : isHovered
            ? 'var(--color-border-strong)'
            : 'var(--color-border-default)'
        }`,
        borderRadius: 'var(--radius-md)',
        transition: 'background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)',
        position: 'relative'
      }}
    >
      {isSuggested && (
        <span
          style={{
            position: 'absolute',
            top: '-9px',
            right: '12px',
            fontSize: '11px',
            fontWeight: 600,
            fontFamily: 'var(--font-mono)',
            backgroundColor: 'var(--color-state-suggested-bg)',
            border: '1px solid var(--color-state-suggested-border)',
            color: 'var(--color-state-suggested-text)',
            padding: '1px 8px',
            borderRadius: 'var(--radius-pill)',
            letterSpacing: '0.02em'
          }}
        >
          Suggested
        </span>
      )}

      {isEditing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Task title"
            autoFocus
            style={{
              width: '100%',
              padding: '8px 12px',
              backgroundColor: 'var(--color-bg-sunken)',
              border: '1px solid var(--color-action-primary)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text-primary)',
              fontSize: 'var(--font-size-body)',
              outline: 'none',
              fontFamily: 'var(--font-ui)'
            }}
          />

          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="Add context or notes (optional)..."
            rows={2}
            style={{
              padding: '8px 12px',
              backgroundColor: 'var(--color-bg-sunken)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--font-size-body)',
              outline: 'none',
              resize: 'none',
              fontFamily: 'var(--font-ui)'
            }}
          />

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ fontSize: 'var(--font-size-label)', color: 'var(--color-text-tertiary)' }}>Priority:</label>
            <select
              value={editedPriority}
              onChange={(e) => setEditedPriority(e.target.value as TaskPriority)}
              style={{
                padding: '4px 8px',
                backgroundColor: 'var(--color-bg-surface)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-label)'
              }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <label style={{ fontSize: 'var(--font-size-label)', color: 'var(--color-text-tertiary)' }}>Time (mins):</label>
            <input
              type="number"
              value={editedMinutes}
              onChange={(e) => setEditedMinutes(parseInt(e.target.value, 10) || 0)}
              style={{
                width: '64px',
                padding: '4px 8px',
                backgroundColor: 'var(--color-bg-surface)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-label)',
                fontFamily: 'var(--font-mono)'
              }}
            />

            <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
              <button
                onClick={handleSave}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 12px',
                  backgroundColor: 'var(--color-action-primary)',
                  color: 'var(--color-action-on-primary)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--font-size-label)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Save size={12} /> Save
              </button>
              <button
                onClick={handleCancel}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 12px',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--font-size-label)',
                  cursor: 'pointer'
                }}
              >
                <X size={12} /> Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            {/* Apple / Things 3 20px Precision Checkbox */}
            <button
              onClick={() => onToggleComplete(task.id)}
              aria-label={isCompleted ? `Mark "${task.title}" incomplete` : `Mark "${task.title}" complete`}
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '5px',
                border: isCompleted ? 'none' : '1.5px solid var(--color-border-strong)',
                backgroundColor: isCompleted ? 'var(--color-action-primary)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                marginTop: '2px',
                padding: 0,
                transition: 'all var(--duration-fast) var(--ease-standard)'
              }}
            >
              {isCompleted && <Check size={13} color="var(--color-action-on-primary)" strokeWidth={2.75} />}
            </button>

            {/* Content: Title, Description, Minimal Metadata */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px' }}>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '20px',
                    color: isCompleted ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
                    textDecoration: isCompleted ? 'line-through' : 'none',
                    transition: 'color var(--duration-fast) var(--ease-standard)'
                  }}
                >
                  {task.title}
                </span>

                {/* Quiet Data Font Duration (Right-aligned, Geist Mono) */}
                {minutes > 0 && (
                  <span
                    className="tabular-nums"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--font-size-data)',
                      color: isCompleted ? 'var(--color-text-tertiary)' : 'var(--color-text-tertiary)',
                      flexShrink: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Clock size={11} strokeWidth={1.75} />
                    {minutes}m
                  </span>
                )}
              </div>

              {/* Description (Quiet secondary body) */}
              {task.description && (
                <p
                  style={{
                    fontSize: '13px',
                    color: isCompleted ? 'var(--color-text-tertiary)' : 'var(--color-text-secondary)',
                    lineHeight: '19px',
                    margin: '3px 0 0 0',
                    textDecoration: isCompleted ? 'line-through' : 'none'
                  }}
                >
                  {task.description}
                </p>
              )}

              {/* Minimal Metadata Strip (Only shown when relevant) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginTop: (task.priority === 'high' || subtasks.length > 0 || task.startTime || task.chunkPart || task.deadlineType === 'HARD') ? '6px' : '0px',
                  flexWrap: 'wrap'
                }}
              >
                {/* High Priority Flag only (Quiet, not loud) */}
                {task.priority === 'high' && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--color-state-failed-text)',
                      fontFamily: 'var(--font-ui)'
                    }}
                  >
                    <Flag size={11} strokeWidth={2} /> High priority
                  </span>
                )}

                {/* Specific scheduled time range if set */}
                {task.startTime && task.endTime && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: 'var(--font-size-data)',
                      color: 'var(--color-text-secondary)',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    {task.startTime} – {task.endTime}
                  </span>
                )}

                {/* Hard Deadline indicator */}
                {task.deadlineType === 'HARD' && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '11px',
                      fontWeight: 500,
                      color: 'var(--color-state-awaiting-text)',
                      fontFamily: 'var(--font-mono)'
                    }}
                    title="Hard scheduling deadline"
                  >
                    <AlertCircle size={10} strokeWidth={2} /> Fixed anchor
                  </span>
                )}

                {/* Auto-cascade bumped cue */}
                {task.scheduleStatus === 'bumped' && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '11px',
                      fontWeight: 500,
                      color: 'var(--color-text-tertiary)',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    <ArrowRightLeft size={10} /> Auto-shifted
                  </span>
                )}

                {/* Motion Chunking */}
                {task.chunkPart && task.totalChunks && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '11px',
                      fontWeight: 500,
                      color: 'var(--color-text-tertiary)',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    <Layers size={10} /> Part {task.chunkPart}/{task.totalChunks}
                  </span>
                )}

                {/* Subtasks expand toggle */}
                {subtasks.length > 0 && (
                  <button
                    onClick={() => setShowSubtasks(!showSubtasks)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      padding: 0,
                      fontSize: '12px',
                      color: 'var(--color-text-secondary)',
                      cursor: 'pointer',
                      fontWeight: 500
                    }}
                  >
                    {showSubtasks ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    <span className="tabular-nums">{completedSubtasks} of {subtasks.length} subtasks</span>
                  </button>
                )}
              </div>
            </div>

            {/* Row Actions: Quiet, appears on hover or focus */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                opacity: isHovered ? 1 : 0,
                pointerEvents: isHovered ? 'auto' : 'none',
                transition: 'opacity var(--duration-fast) var(--ease-standard)'
              }}
            >
              <button
                onClick={() => setIsAddingSubtask(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-tertiary)',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Add subtask"
                aria-label="Add subtask"
              >
                <Plus size={14} />
              </button>
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-tertiary)',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Edit task"
                aria-label="Edit task"
              >
                <Edit2 size={13} />
              </button>
              {onDeleteTask && (
                <button
                  onClick={() => onDeleteTask(task.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-text-tertiary)',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Delete task"
                  aria-label="Delete task"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Subtasks Accordion Content */}
          {showSubtasks && subtasks.length > 0 && (
            <div
              style={{
                marginTop: '10px',
                paddingLeft: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              {subtasks.map((sub) => {
                const subDone = Boolean(sub.isCompleted || sub.done);
                return (
                  <div
                    key={sub.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '5px 8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--color-bg-sunken)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => handleToggleSubtask(sub.id)}
                        style={{
                          width: '15px',
                          height: '15px',
                          borderRadius: '3px',
                          border: subDone ? 'none' : '1px solid var(--color-border-strong)',
                          backgroundColor: subDone ? 'var(--color-action-primary)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        {subDone && <Check size={10} color="var(--color-action-on-primary)" strokeWidth={2.5} />}
                      </button>
                      <span
                        style={{
                          fontSize: '13px',
                          color: subDone ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
                          textDecoration: subDone ? 'line-through' : 'none'
                        }}
                      >
                        {sub.title}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {(sub.estimatedMinutes || sub.minutes) && (
                        <span
                          className="tabular-nums"
                          style={{
                            fontSize: 'var(--font-size-data)',
                            color: 'var(--color-text-tertiary)',
                            fontFamily: 'var(--font-mono)'
                          }}
                        >
                          {sub.estimatedMinutes || sub.minutes}m
                        </span>
                      )}
                      <button
                        onClick={() => handleDeleteSubtask(sub.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--color-text-tertiary)',
                          cursor: 'pointer',
                          padding: '2px'
                        }}
                        title="Delete subtask"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Inline Add Subtask Input */}
          {isAddingSubtask && (
            <div style={{ marginTop: '8px', paddingLeft: '32px', display: 'flex', gap: '6px' }}>
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Subtask title..."
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddSubtask();
                  if (e.key === 'Escape') setIsAddingSubtask(false);
                }}
                style={{
                  flex: 1,
                  padding: '5px 8px',
                  backgroundColor: 'var(--color-bg-sunken)',
                  border: '1px solid var(--color-action-primary)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-text-primary)',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              <button
                onClick={handleAddSubtask}
                style={{
                  padding: '5px 10px',
                  backgroundColor: 'var(--color-action-primary)',
                  color: 'var(--color-action-on-primary)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Add
              </button>
              <button
                onClick={() => setIsAddingSubtask(false)}
                style={{
                  padding: '5px 8px',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
