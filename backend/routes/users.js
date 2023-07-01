import express from "express";
import * as usersController from "../controllers/usersController.js";
const router = express.Router();

router.route("/email").get(usersController.getUserByEmail);

export default router;
