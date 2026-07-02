import { useState } from "react";
import type { Task, TaskStatus } from "../types";

interface Props {
  task: Task;
  onUpdate: (id: number, changes: Partial<Pick<Task, "title" | "description" | "status">>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const STATUS_OPTIONS: TaskStatus[] = ["pending", "in-progress", "completed"];

export function TaskItem({ task, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await onUpdate(task.id, { title, description: description || null });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setTitle(task.title);
    setDescription(task.description ?? "");
    setEditing(false);
  }

  return (
    <li className={`task-item status-${task.status}`}>
      {editing ? (
        <div className="task-edit">
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          <div className="task-actions">
            <button onClick={handleSave} disabled={saving || !title.trim()}>
              Save
            </button>
            <button onClick={handleCancel} disabled={saving}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-main">
            <strong>{task.title}</strong>
            {task.description && <p>{task.description}</p>}
          </div>
          <div className="task-actions">
            <select
              value={task.status}
              onChange={(e) => onUpdate(task.id, { status: e.target.value as TaskStatus })}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button onClick={() => setEditing(true)}>Edit</button>
            <button onClick={() => onDelete(task.id)} className="danger">
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}
