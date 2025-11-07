const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// -------------------- MIDDLEWARE --------------------
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// -------------------- ROUTES --------------------
app.use("/api/auth", require("./routes/auth"));
app.use("/api/questions", require("./routes/question"));
app.use("/api/attempts", require("./routes/attempt"));

// -------------------- TEST ROUTE --------------------
app.get("/", (req, res) => res.send("Adaptive Learning Backend Running 🚀"));

// -------------------- 404 HANDLER --------------------
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// -------------------- ERROR HANDLER --------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Server error" });
});

// -------------------- MONGODB CONNECTION --------------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ Database Connection Error:", err);
    process.exit(1); // Exit process if DB fails to connect
  }
};
connectDB();

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
