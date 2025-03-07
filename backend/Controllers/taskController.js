import Task from "../models/taskModel.js";
import nodemailer from "nodemailer";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

// Email Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_MAIL, // Replace with your email
    pass: process.env.EMAIL_PASSWORD, // Replace with your app password
  },
});

// Add Task and send mail to the user
export const addTask = async (req, res) => {
    const { title, description, dueDate, priority, status, assignedTo } =
      req.body;
  
    try {
      // Validate required fields
      if (!title || !description || !assignedTo) {
        return res
          .status(400)
          .json({ message: "Title, description and assigned user are required" });
      }
  
      const user = await User.findOne({ username: assignedTo });
      if (!user) {
        return res.status(404).json({ message: "User not found.", error });
      }
  
      // Create the task
      const task = new Task({
        title,
        description,
        dueDate,
        priority,
        status,
        assignedTo,
      });
  
      await task.save();
  
      // Send Email
      const mailOptions = {
        from: process.env.ADMIN_MAIL,
        to: user.email, // User's email address
        subject: "New Task Assigned",
        html: `
          <h3>New Task Assigned</h3>
          <p>Hello ${user.username},</p>
          <p>You have been assigned a new task:</p>
          <p><strong>Title:</strong> ${task.title}</p>
          <p><strong>Description:</strong> ${task.description}</p>
          <p><strong>Due Date:</strong> ${task.dueDate}</p>
          <p><strong>Priority:</strong> ${task.priority}</p>
          <br/>
          <p>Please log in to the system to view more details.</p>
        `,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(201).json({ message: "task added and notification sent", task });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Error adding task", error: error.message });
    }
  };


// Load Task by ID
export const getTaskById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Error fetching task", error });
    }
  };


//update tasks and send email to the users
export const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, dueDate, priority, assignedTo } = req.body;
  
    try {
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      // Track whether updates were made
      let updated = false;
  
      if (title && title !== task.title) {
        task.title = title;
        updated = true;
      }
      if (description && description !== task.description) {
        task.description = description;
        updated = true;
      }
      if (dueDate) {
        const parsedDate = new Date(dueDate);
        if (!isNaN(parsedDate)) {
          task.dueDate = parsedDate;
          updated = true;
        } else {
          return res.status(400).json({ message: "Invalid due date format" });
        }
      }
      if (priority && priority !== task.priority) {
        task.priority = priority;
        updated = true;
      }
      if (assignedTo && assignedTo !== task.assignedTo) {
        const user = await User.findOne({ username: assignedTo });
        if (!user) {
          return res.status(400).json({ message: "Assigned user not found" });
        }
        task.assignedTo = assignedTo;
        updated = true;
      }
  
      if (!updated) {
        return res.status(400).json({ message: "No changes detected" });
      }
  
      await task.save();
  
      // Notify assigned user about task update
      const user = await User.findOne({ username: task.assignedTo });
      if (user) {
        const mailOptions = {
          from: process.env.ADMIN_MAIL,
          to: user.email,
          subject: "Task Updated",
          html: `
            <h3>Your Task Has Been Updated</h3>
            <p>Hello ${user.username},</p>
            <p>Your assigned task has been updated:</p>
            <ul>
              <li><strong>Title:</strong> ${task.title}</li>
              <li><strong>Description:</strong> ${task.description}</li>
              <li><strong>Due Date:</strong> ${task.dueDate.toDateString()}</li>
              <li><strong>Priority:</strong> ${task.priority}</li>
              <li><strong>Status:</strong> ${task.status}</li>
            </ul>
          `,
        };
  
        try {
          await transporter.sendMail(mailOptions);
        } catch (emailError) {
          console.error("Error sending email:", emailError);
        }
      }
  
      res.json({ message: "Task updated successfully", task });
    } catch (error) {
      console.error("Update Task Error:", error);
      res.status(500).json({ message: "Error updating task", error });
    }
  };

// Delete task and send email to the assigned user
export const deleteTask = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the task to get details for the email
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      // Delete the task
      await Task.findByIdAndDelete(id);
  
      // Notify the assigned user about the task deletion
      const user = await User.findOne({ username: task.assignedTo });
      if (user) {
        const mailOptions = {
          from: process.env.ADMIN_MAIL,
          to: user.email,
          subject: "Task Deleted",
          html: `
            <h3>Your Task Has Been Removed</h3>
            <p>Hello ${user.username},</p>
            <p>Your assigned task has been removed by the admin:</p>
            <ul>
              <li><strong>Title:</strong> ${task.title}</li>
              <li><strong>Description:</strong> ${task.description}</li>
            </ul>
          `,
        };
  
        // Send the email to the assigned user
        await transporter.sendMail(mailOptions);
      } else {
        return res.status(404).json({ message: "Assigned user not found" });
      }
  
      // Respond with a success message after task deletion and email
      res.json({ message: "Task deleted successfully, email sent to the user" });
    } catch (error) {
      console.error(error); // For debugging
      res.status(500).json({ message: "Error deleting task or sending email" });
    }
  };
  