import { useState } from "react";
import { FiEdit2, FiTrash2, FiCheck, FiClock } from "react-icons/fi";
import TaskForm from "./TaskForm";

function TaskCard({ task, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleComplete = async () => {
    await onUpdate(task._id, { completed: !task.completed });
  };

  const handleEdit = async (data) => {
    await onUpdate(task._id, data);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task._id);
    } catch {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isEditing) {
    return (
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', background: '#f8fafc' }}>
        <TaskForm
          initialData={task}
          onSubmit={handleEdit}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`} style={isDeleting ? { opacity: 0.3, pointerEvents: 'none' } : {}}>
      <button 
        className={`checkbox-btn ${task.completed ? 'checked' : ''}`} 
        onClick={handleToggleComplete}
      >
        <FiCheck strokeWidth={3} size={14} style={{ opacity: task.completed ? 1 : 0 }} />
      </button>
      
      <div className="task-content">
        <div className="task-title">{task.title}</div>
        {task.description && (
          <div className="task-desc">{task.description}</div>
        )}
        <div className="task-meta">
          <FiClock /> {formatDate(task.createdAt)}
        </div>
      </div>

      <div className="task-actions">
        <button onClick={() => setIsEditing(true)} className="action-btn edit" title="Edit">
          <FiEdit2 size={16} />
        </button>
        <button onClick={handleDelete} disabled={isDeleting} className="action-btn delete" title="Delete">
          <FiTrash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
