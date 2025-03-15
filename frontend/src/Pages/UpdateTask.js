import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function UpdateTask() {
  let navigate = useNavigate();
  const { id } = useParams();

  const [createtask, set_task] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "",
    assignedTo: "",
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // Error state for API failures

  const { title, description, dueDate, priority, assignedTo } = createtask;

  const onInputChange = (e) => {
    set_task({ ...createtask, [e.target.name]: e.target.value });
  };

  // Fetch task and users when the component is mounted
  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const result = await axios.get(
          `http://localhost:8000/tasks/gettaskbyid/${id}`
        );
        set_task(result.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching task:", error);
        setError("Failed to fetch task details.");
      }
    };

    const loadUsers = async () => {
      try {
        const result = await axios.get("http://localhost:8000/tasks/users");
        setUsers(result.data);
      } catch (error) {
        console.error("Error loading users:", error);
        setError("Failed to load users.");
      }
    };

    fetchTaskData();
    loadUsers();
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/tasks/update/${id}`, createtask);
      navigate("/admin"); // Navigate to admin page after task is updated
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Failed to update task.");
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Loading message until task is fetched
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary rounded-5 p-3">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            TMS
          </Link>
          <Link className="btn btn-outline-light p-2 ms-4" to="/admin">
            Admin Home
          </Link>
        </div>
      </nav>

      <div className="mx-auto p-2 w-50 mt-5">
        <div className="align-middle rounded-5 border shadow p-4">
          <h2 className="text-center m-4">Update Task</h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Title"
                name="title"
                value={title}
                onChange={onInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter description"
                name="description"
                value={description}
                onChange={onInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="dueDate" className="form-label">
                Due Date
              </label>
              <input
                type="date"
                className="form-control"
                name="dueDate"
                value={dueDate}
                onChange={onInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="priority" className="form-label">
                Priority
              </label>
              <select
                className="form-control"
                name="priority"
                value={priority}
                onChange={onInputChange}
                required
              >
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="assignedTo" className="form-label">
                Assign To
              </label>
              <select
                className="form-control"
                name="assignedTo"
                value={assignedTo}
                onChange={onInputChange}
                required
              >
                <option value="">Select User</option>
                {users.length > 0 ? (
                  users.map((user) => (
                    <option key={user._id} value={user.username}>
                      {user.username}
                    </option>
                  ))
                ) : (
                  <option value="">No users found</option>
                )}
              </select>
            </div>

            <button type="submit" className="btn btn-outline-primary mt-4 mb-5">
              Submit
            </button>
            <Link className="btn btn-outline-danger mx-2 mt-4 mb-5" to="/">
              Cancel
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
