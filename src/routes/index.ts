import { Request, Response, Router } from "express";
import { UserController } from "../controllers/user";
import { createUserValidation } from "../helper/validator/postUser.validator";

export default class MainRouter {
  router: Router;
  userController: UserController;

  constructor() {
    // Initialize controllers objects
    this.userController = new UserController();

    // Initialize router object
    this.router = Router({ mergeParams: true });
    this.userRoutes();
  }

  private userRoutes() {
    this.router.get("/", (req, res) => {
      res.json({
        message: "Welcome to the API",
      });
    });

  }
}
