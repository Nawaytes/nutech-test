import { Request, Response, Router } from "express";
import { UserController } from "../controllers/user";
import { validationMiddleware } from "../middleware/validation.middleware";
import { CreateUserDto } from "../dto/user/postUser.dto";
import { AuthController } from "../controllers/auth.controller";
import { LoginDto } from "../dto/auth/login.dto";
import { jwtMiddleware } from "../middleware/jwt.middleware";

export default class MainRouter {
  router: Router;
  userController: UserController;
  authController: AuthController;

  constructor() {
    // Initialize controllers objects
    this.userController = new UserController();
    this.authController = new AuthController();

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

    this.router
      .route("/registration")
      .post(
        validationMiddleware(CreateUserDto),
        (req: Request, res: Response) => this.userController.create(req, res)
      );

    this.router
      .route("/login")
      .post(validationMiddleware(LoginDto), (req: Request, res: Response) =>
        this.authController.login(req, res)
      );

    this.router
      .route("/profile")
      .get(jwtMiddleware(), (req: Request, res: Response) =>
        this.userController.detail(req, res)
      );
  }
}
