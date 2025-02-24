import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    default: Date.now(),
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low",
  },
  status: {
    type: String,
    enum: ["Active", "inactive"],
    default: "Active", // default status is Active when task is created
  },
  completed: { type: Boolean, default: false },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  assignedTo: {  // Reference to the User model
    type: String,
    ref: "User",  // Reference to the User model
  }, 
  createdBy: { // Reference to the Admin
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Admin" 
  }, 
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
