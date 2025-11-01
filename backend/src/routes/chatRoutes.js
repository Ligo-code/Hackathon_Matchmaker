import express from "express";
import { createChatRoom, getUserChats } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", createChatRoom);
router.get("/:userId", getUserChats);

export default router;
