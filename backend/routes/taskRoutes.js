import express from "express";
import {
  addTask,
  updateTask,
  deleteTask,
  getTasks,
  markTaskCompleted,
  getTaskById,
  deleteUser,
  
} from "../controllers/taskController.js";
import { getAllUsers } from "../controllers/authController.js";

const router = express.Router();

// Admin Routes
router.post("/add",  addTask); // Admin can add tasks
router.get("/gettaskbyid/:id" ,getTaskById) //gettask by id to update
router.put("/update/:id", updateTask); // Admin can update tasks
router.delete('/delete/:id', deleteTask); // Admin can delete tasks
router.get("/users", getAllUsers); //get all users
router.delete("/deleteuser/:id", /*protect,isAdmin,*/ deleteUser)

// User Routes
router.get("/", getTasks); // Users can view tasks (get all tasks)
router.put("/complete/:id", markTaskCompleted); // Users can mark tasks as completed

export default router;
