import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import '../CSS/adminpage.css';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
    loadTasks();
  }, []);

  const loadUsers = async () => {
    try {
      const result = await axios.get("http://localhost:8000/tasks/users");
      setUsers(result.data);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const loadTasks = async () => {
    try {
      const result = await axios.get("http://localhost:8000/tasks");
      setTasks(result.data);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/tasks/deleteuser/${id}`);
      loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/tasks/delete/${id}`);
      loadTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div className="admin-container">
      {/* Navbar */}
      <nav className="navbar">
        <Link className="navbar-brand" to="/admin">
          TaskFlow Pro
        </Link>
        <div className="d-flex gap-2"> 
          <Link className="btn add-task-btn" to="/addtask">
            ➕ Add Task
          </Link>
          <button className="btn logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </nav>

      <h1 className="admin-title">Admin Dashboard</h1>

      {/* Users Table */}
      <div className="table-container">
        <h2 className="section-title">Users</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Telephone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>
                <td>
                  <button className="btn delete-btn" onClick={() => deleteUser(user._id)}>
                    ❌ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tasks Table */}
      <div className="table-container">
        <h2 className="section-title">Tasks</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Assigned User</th>
              <th>Priority</th>
              <th>Completed</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.dueDate}</td>
                <td>{task.assignedTo}</td>
                <td>{task.priority}</td>
                <td>{task.completed ? "✔️" : "❌"}</td>
                <td>{task.status}</td>
                <td>
                  <Link className="btn update-btn" to={`/updatetask/${task._id}`}>
                    ✏️ Update
                  </Link>
                  <button className="btn delete-btn" onClick={() => deleteTask(task._id)}>
                    ❌ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
