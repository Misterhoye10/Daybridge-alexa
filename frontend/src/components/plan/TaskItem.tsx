import React, { useState } from 'react';
import type { Task, TaskPriority } from '../../types/daybridge';
import { Check, Clock, Edit2, Trash2, Calendar, Save, X, ChevronDown, ChevronRight, Plus } from 'lucide-react';

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
  const [showSubtasks, setShowSubtasks] = useState(true);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedPriority, setEditedPriority] = useState<TaskPriority>(task.priority || 'medium');
  const [editedMinutes, setEditedMinutes] = useState(task.estimatedMinutes || 30);
  const [editedEmoji, setEditedEmoji] = useState(task.categoryEmoji || '');

  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter((s) => s.isCompleted).length;

  // Calculate total minutes: if has subtasks with estimates, sum them up (from reverse engineering!)
  const subtasksMinutes = subtasks.reduce((sum, s) => sum + (s.estimatedMinutes || 0), 0);
  const totalMinutes = subtasksMinutes > 0 ? subtasksMinutes : (task.estimatedMinutes || 30);

  const handleSave = () => {
    if (onUpdateTask) {
      onUpdateTask({
        ...task,
        title: editedTitle,
        description: editedDescription,
        priority: editedPriority,
        estimatedMinutes: editedMinutes,
        categoryEmoji: editedEmoji
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setEditedPriority(task.priority || 'medium');
    setEditedMinutes(task.estimatedMinutes || 30);
    setEditedEmoji(task.categoryEmoji || '');
    setIsEditing(false);
  };

  const handleToggleSubtask = (subtaskId: string) => {
    if (!onUpdateTask) return;
    const updatedSubtasks = subtasks.map((s) =>
      s.id === subtaskId ? { ...s, isCompleted: !s.isCompleted } : s
    );
    // If all subtasks completed, auto-complete parent
    const allDone = updatedSubtasks.length > 0 && updatedSubtasks.every((s) => s.isCompleted);
    onUpdateTask({
      ...task,
      isCompleted: allDone ? true : task.isCompleted,
      subtasks: updatedSubtasks
    });
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim() || !onUpdateTask) return;

    const newSub: Task = {
      id: `sub-${Date.now()}`,
      parentId: task.id,
      title: newSubtaskTitle.trim(),
      description: '',
      estimatedMinutes: 15,
      isCompleted: false,
      orderIndex: subtasks.length
    };

    onUpdateTask({
      ...task,
      subtasks: [...subtasks, newSub]
    });
    setNewSubtaskTitle('');
    setIsAddingSubtask(false);
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    if (!onUpdateTask) return;
    onUpdateTask({
      ...task,
      subtasks: subtasks.filter((s) => s.id !== subtaskId)
    });
  };

  const priorityColors = {
    high: { border: '#F43F5E', text: '#FDA4AF', bg: 'rgba(244, 63, 94, 0.1)' },
    medium: { border: '#FDBA74', text: '#FED7AA', bg: 'rgba(253, 186, 116, 0.1)' },
    low: { border: '#94A3B8', text: '#CBD5E1', bg: 'rgba(148, 163, 184, 0.1)' }
  }[task.priority || 'medium'];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '14px 16px',
        backgroundColor: task.isCompleted ? 'rgba(18, 24, 38, 0.45)' : 'var(--bg-card)',
        border: `1px solid ${isSuggested ? 'var(--state-suggested-border)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-md)',
        marginBottom: '10px',
        transition: 'all var(--transition-normal)',
        position: 'relative',
        opacity: task.isCompleted ? 0.72 : 1,
        boxShadow: isSuggested ? '0 0 15px rgba(253, 186, 116, 0.15)' : 'none'
      }}
    >
      {isSuggested && (
        <span
          style={{
            position: 'absolute',
            top: '-8px',
            right: '14px',
            fontSize: '0.65rem',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            backgroundColor: '#FDBA74',
            color: '#1A1208',
            padding: '1px 7px',
            borderRadius: 'var(--radius-full)'
          }}
        >
          Suggested addition
        </span>
      )}

      {isEditing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={editedEmoji}
              onChange={(e) => setEditedEmoji(e.target.value)}
              placeholder="Emoji"
              style={{
                width: '44px',
                textAlign: 'center',
                padding: '6px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Task Title"
              style={{
                flex: 1,
                padding: '8px 12px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--brand-cyan)',
                borderRadius: 'var(--radius-sm)',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="Task description..."
            rows={2}
            style={{
              padding: '8px 12px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              outline: 'none',
              resize: 'vertical'
            }}
          />

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Priority:</label>
            <select
              value={editedPriority}
              onChange={(e) => setEditedPriority(e.target.value as TaskPriority)}
              style={{
                padding: '4px 8px',
                backgroundColor: 'var(--bg-surface)',
                color: '#FFF',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem'
              }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Time (mins):</label>
            <input
              type="number"
              value={editedMinutes}
              onChange={(e) => setEditedMinutes(parseInt(e.target.value) || 0)}
              style={{
                width: '60px',
                padding: '4px 6px',
                backgroundColor: 'var(--bg-surface)',
                color: '#FFF',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem'
              }}
            />

            <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
              <button
                onClick={handleSave}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 10px',
                  backgroundColor: 'var(--brand-teal)',
                  color: '#0B0F1A',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
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
                  padding: '5px 10px',
                  backgroundColor: 'transparent',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
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
            {/* Custom Checkbox */}
            <button
              onClick={() => onToggleComplete(task.id)}
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '6px',
                border: task.isCompleted ? 'none' : '1.5px solid var(--border-medium)',
                background: task.isCompleted ? 'var(--brand-gradient)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                marginTop: '2px',
                transition: 'var(--transition-fast)'
              }}
              title={task.isCompleted ? 'Mark incomplete' : 'Mark completed'}
            >
              {task.isCompleted && <Check size={14} color="#0B0F1A" strokeWidth={3} />}
            </button>

            {/* Task Main Content */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                {task.categoryEmoji && (
                  <span style={{ fontSize: '1rem', lineHeight: 1 }}>{task.categoryEmoji}</span>
                )}
                <span
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: task.isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                    textDecoration: task.isCompleted ? 'line-through' : 'none',
                    lineHeight: 1.4
                  }}
                >
                  {task.title}
                </span>
              </div>

              {task.description && (
                <p
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)',
                    marginTop: '4px',
                    lineHeight: 1.45
                  }}
                >
                  {task.description}
                </p>
              )}

              {/* Badges / Metadata */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                {task.day && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.72rem',
                      color: 'var(--brand-cyan)',
                      backgroundColor: 'rgba(14, 165, 233, 0.1)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    <Calendar size={11} /> {task.day}
                  </span>
                )}

                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)'
                  }}
                  title={subtasksMinutes > 0 ? 'Aggregated from subtasks' : 'Estimated time'}
                >
                  <Clock size={11} /> {totalMinutes}m {subtasksMinutes > 0 && '(rollup)'}
                </span>

                {task.priority && (
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      color: priorityColors.text,
                      backgroundColor: priorityColors.bg,
                      border: `1px solid ${priorityColors.border}`,
                      padding: '1px 6px',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    {task.priority}
                  </span>
                )}

                {/* Subtask count badge */}
                {subtasks.length > 0 && (
                  <button
                    onClick={() => setShowSubtasks(!showSubtasks)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '2px 6px',
                      fontSize: '0.7rem',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    {showSubtasks ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                    <span>{completedSubtasks}/{subtasks.length} subtasks</span>
                  </button>
                )}
              </div>
            </div>

            {/* Actions (Edit / Delete / Add Subtask) */}
            <div style={{ display: 'flex', gap: '3px', opacity: 0.85 }}>
              <button
                onClick={() => setIsAddingSubtask(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Add Subtask"
              >
                <Plus size={13} />
              </button>
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Edit task"
              >
                <Edit2 size={13} />
              </button>
              {onDeleteTask && (
                <button
                  onClick={() => onDeleteTask(task.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Delete task"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Subtasks Section */}
          {showSubtasks && subtasks.length > 0 && (
            <div
              style={{
                marginTop: '12px',
                paddingLeft: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                borderLeft: '2px solid rgba(255, 255, 255, 0.08)',
                marginLeft: '10px'
              }}
            >
              {subtasks.map((sub) => (
                <div
                  key={sub.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '4px 8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={sub.isCompleted}
                      onChange={() => handleToggleSubtask(sub.id)}
                      style={{ cursor: 'pointer', accentColor: 'var(--brand-teal)' }}
                    />
                    <span
                      style={{
                        color: sub.isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                        textDecoration: sub.isCompleted ? 'line-through' : 'none'
                      }}
                    >
                      {sub.title}
                    </span>
                    {sub.estimatedMinutes && (
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {sub.estimatedMinutes}m
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteSubtask(sub.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '2px'
                    }}
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Inline Add Subtask Input */}
          {isAddingSubtask && (
            <form
              onSubmit={handleAddSubtask}
              style={{
                marginTop: '8px',
                paddingLeft: '32px',
                display: 'flex',
                gap: '6px'
              }}
            >
              <input
                type="text"
                autoFocus
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Enter subtask title..."
                style={{
                  flex: 1,
                  padding: '4px 8px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  color: '#FFF',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '4px 8px',
                  backgroundColor: 'var(--brand-teal)',
                  color: '#0B0F1A',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsAddingSubtask(false)}
                style={{
                  padding: '4px 8px',
                  backgroundColor: 'transparent',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.72rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
};
