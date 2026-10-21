import React, { useState } from 'react';
import type { Task, TaskPriority } from '../../types/daybridge';
import { Check, Clock, Edit2, Trash2, Calendar, Save, X } from 'lucide-react';

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
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedPriority, setEditedPriority] = useState<TaskPriority>(task.priority || 'medium');
  const [editedMinutes, setEditedMinutes] = useState(task.estimatedMinutes || 30);

  const handleSave = () => {
    if (onUpdateTask) {
      onUpdateTask({
        ...task,
        title: editedTitle,
        description: editedDescription,
        priority: editedPriority,
        estimatedMinutes: editedMinutes
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setEditedPriority(task.priority || 'medium');
    setEditedMinutes(task.estimatedMinutes || 30);
    setIsEditing(false);
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
        opacity: task.isCompleted ? 0.7 : 1,
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
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Task Title"
            style={{
              padding: '8px 12px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--brand-cyan)',
              borderRadius: 'var(--radius-sm)',
              color: '#FFFFFF',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
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

          {/* Task Info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
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

              {task.estimatedMinutes && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  <Clock size={11} /> {task.estimatedMinutes}m
                </span>
              )}

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
            </div>
          </div>

          {/* Action buttons (Edit/Delete) */}
          <div style={{ display: 'flex', gap: '4px', opacity: 0.8 }}>
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
      )}
    </div>
  );
};
