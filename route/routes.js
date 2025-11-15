import express from "express";
import convController from "../controller/convController.js";
import userController from "../controller/userController.js";

const router = express.Router();

router.get("/users", userController.getAll);
router.get("/users/online", userController.getOnline);
router.get("/convs", convController.getAll);
router.get("/conv", convController.getById);

router.post("/login", userController.login);
router.post("/conv/create", convController.create);

export default router;
