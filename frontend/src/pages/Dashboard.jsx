import { useState, useEffect } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import { FiPlus, FiInbox } from "react-icons/fi";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await API.get("/api/tasks");
      setTasks(response.data);
    } catch (error) {
      toast.error("Failed to fetch tasks.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (data) => {
    try {
      const response = await API.post("/api/tasks", data);
      setTasks((prev) => [response.data, ...prev]);
      setShowForm(false);
      toast.success("Task created!");
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to create task.";
      toast.error(msg);
      throw error;
    }
  };

  const handleUpdateTask = async (id, data) => {
    try {
      const response = await API.put(`/api/tasks/${id}`, data);
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? response.data : task))
      );
      toast.success("Task updated!");
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to update task.";
      toast.error(msg);
      throw error;
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await API.delete(`/api/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      toast.success("Task deleted!");
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to delete task.";
      toast.error(msg);
      throw error;
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const activeTasks = totalTasks - completedTasks;

  const filterOptions = [
    { key: "all", label: "All Tasks" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
  ];

  return (
    <div>
      <Navbar />

      <main className="main-container">
        
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>Dashboard</h1>
            <p>Manage your tasks and stay productive.</p>
          </div>
          <div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary"
                style={{width: 'auto'}}
              >
                <FiPlus style={{marginRight: '8px'}} />
                New Task
              </button>
            )}
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total</div>
            <div className="stat-value">{totalTasks}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active</div>
            <div className="stat-value active">{activeTasks}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Done</div>
            <div className="stat-value done">{completedTasks}</div>
          </div>
        </div>

        <div className="filters-wrapper">
          {filterOptions.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`filter-btn ${filter === key ? "active" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>

        {showForm && (
          <TaskForm onSubmit={handleCreateTask} onCancel={() => setShowForm(false)} />
        )}

        <div className="tasks-container">
          {loading ? (
            <div className="task-empty">Loading tasks...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="task-empty">
              <FiInbox style={{width: '48px', height: '48px', margin: '0 auto 16px'}} />
              <h3>No tasks to show</h3>
              <p>Get started by creating a new task.</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
