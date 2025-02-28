import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

export default function UserHomePage() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const userId = localStorage.getItem('username'); // Assuming the user ID is saved in localStorage after login
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/tasks/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  useEffect(() => {
    
    fetchTasks();
  }, []);

  const markAsComplete = async (taskId) => {
    try {
      await axios.put(`http://localhost:8000/tasks/complete/${taskId}`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Update task status in the state and disable the button after marking it complete
      setTasks((prevTasks) =>
        prevTasks.map(task =>
          task._id === taskId ? { ...task, status: 'inactive', completed: true } : task
        )
      );
      
    fetchTasks();
    
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/'); // Redirect to login page
  };

  return (
    
    <div>
    <Navbar />

      <div className="container mt-5">
        <h2 className="text-center">Your Tasks</h2>
        <div className="list-group mt-4">
          {tasks.length > 0 ? (
            tasks.map(task => (
              <div key={task._id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <h5>Task Title : {task.title}</h5>
                  <p></p>
                  <p>Description : {task.description}</p>
                  <p>Priority : {task.priority}</p>
                  <p>Assigned To: {task.assignedTo}</p>
                  <p>Due: {task.dueDate}</p>
                  <p></p>
                  <p>Completed : {task.completed ? "Yes" : "No" }</p>
                  <p>Status : {task.status}</p>
                </div>
                <button 
                  className="btn btn-success" 
                  onClick={() => markAsComplete(task._id)}
                  disabled={task.completed}
                >
                  {task.completed ? 'completed' : 'Mark as Complete'}
                </button>
              </div>
            ))
          ) : (
            <p className="text-center">No tasks assigned.</p>
          )}
        </div>
      </div>
      <div>
    
 

   </div>
    </div>
   
 
     
  );
}
