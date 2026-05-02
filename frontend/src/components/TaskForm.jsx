import { useState } from "react";

function TaskForm({ onSubmit, initialData, onCancel }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [submitting, setSubmitting] = useState(false);

  const isEditing = !!initialData;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), description: description.trim() });
      if (!isEditing) {
        setTitle("");
        setDescription("");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`form-container ${isEditing ? 'inline' : ''}`}>
      <div className="form-group" style={{ marginBottom: '12px' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          autoFocus
        />
      </div>
      <div className="form-group" style={{ marginBottom: '0' }}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={2}
          style={{ resize: 'none' }}
        />
      </div>
      <div className="form-actions">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
        <button type="submit" disabled={!title.trim() || submitting} className="btn-brand">
          {isEditing ? "Save Changes" : "Add Task"}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
