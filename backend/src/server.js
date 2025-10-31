import dotenv from "dotenv";
const { PORT = 8000 } = process.env;
import app from "./app.js";
import connectDB from "./config/db.js";

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
    const listener = () => console.log(`Listening on Port ${PORT}!`);
    app.listen(PORT, listener);
  } catch (error) {
    console.log(error);
  }
};

start();
