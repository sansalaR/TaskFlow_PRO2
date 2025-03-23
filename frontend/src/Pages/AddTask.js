import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import "../CSS/AddTask.css";


export default function AddTask() {
  let navigate = useNavigate();

  const [createtask, set_task] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "",
    assignedTo: "",
  });

  const [users, setUsers] = useState([]);

  const { title, description, dueDate, priority, assignedTo } = createtask;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/tasks/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };
    fetchUsers();
  }, []);

  const onInputChange = (e) => {
    set_task({ ...createtask, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/tasks/add", createtask);
      navigate("/admin");
    } catch (error) {
      console.error("Error adding task", error);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="container my-5">
        <div className="row align-items-center">
          
          {/* Left Content - Motivational Section */}
          <div className="col-md-4 text-center task-info">
            <h3>🚀 Boost Your Productivity!</h3>
            <p>Break down tasks, set priorities, and meet deadlines effortlessly. Stay on top of your work!</p>
            <ul>
              <li>📝 Define clear goals</li>
              <li>⏳ Set realistic deadlines</li>
              <li>✅ Track progress effectively</li>
            </ul>
          </div>

          {/* Form Section */}
          <div className="col-md-4">
            <div className="form-container">
              <h2 className="text-center">Add Task</h2>
              <form onSubmit={onSubmit}>
                
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input type="text" className="form-control" name="title" value={title} onChange={onInputChange} placeholder="Enter Title" />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <input type="text" className="form-control" name="description" value={description} onChange={onInputChange} placeholder="Enter Description" />
                </div>

                <div className="mb-3">
                  <label htmlFor="dueDate" className="form-label">Due Date</label>
                  <input type="date" className="form-control" name="dueDate" value={dueDate} onChange={onInputChange} />
                </div>

                <div className="mb-3">
                  <label htmlFor="priority" className="form-label">Priority</label>
                  <select className="form-control" name="priority" value={priority} onChange={onInputChange} required>
                    <option value="">Select Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="assignedTo" className="form-label">Assign To</label>
                  <select className="form-control" name="assignedTo" value={assignedTo} onChange={onInputChange}>
                    <option value="">Select User</option>
                    {users.length > 0 ? users.map((user) => (
                      <option key={user._id} value={user.username}>{user.username}</option>
                    )) : <option value="">No users found</option>}
                  </select>
                </div>

                <button type="submit" className="btn btn-outline-primary mt-3">Submit</button>
                <Link className="btn btn-outline-danger mx-2 mt-3" to="/">Cancel</Link>
              </form>
            </div>
          </div>


        </div>
      </div>

      <Footer />
    </div>
  );
}
