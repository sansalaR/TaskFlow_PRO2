// src/App.js
import React from 'react';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddTask from './Pages/AddTask';
import Register from './Pages/Register';
import Login from './Pages/Login';
import AdminPage from './Pages/AdminPage';
import UserHomePage from './Pages/UserHomePage';
import UpdateTask from './Pages/UpdateTask';


const App = () => {
  return (
    <Router>
      
      <Routes>
        <Route exact path="/addtask" element={<AddTask/>} />
        <Route exact path="/home" element={<UserHomePage/>} />
        <Route exact path="/register" element={<Register/>} />
        <Route exact path="/" element={<Login/>} />
        <Route exact path="/admin" element={<AdminPage/>} />
        <Route exact path="/updatetask/:id" element={<UpdateTask/>} />

      </Routes>
    </Router>
  );
};

export default App;
