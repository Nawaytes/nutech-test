import { Request, Response, Router } from "express";
import { UserController } from "../controllers/user";
import { validationMiddleware } from "../middleware/validation.middleware";
import { CreateUserDto } from "../dto/user/postUser.dto";
import { AuthController } from "../controllers/auth.controller";
import { LoginDto } from "../dto/auth/login.dto";
import { jwtMiddleware } from "../middleware/jwt.middleware";
import { UpdateProfileDTO } from "../dto/updateProfile.dto";
import { InformationController } from "../controllers/information.controllers";
import { TransactionController } from "../controllers/transaction.controller";

export default class MainRouter {
  router: Router;
  userController: UserController;
  authController: AuthController;
  informationController: InformationController;
  trxController: TransactionController;

  constructor() {
    // Initialize controllers objects
    this.userController = new UserController();
    this.authController = new AuthController();
    this.informationController = new InformationController();
    this.trxController = new TransactionController();

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
    this.router.put(
      "/profile/update",
      jwtMiddleware(),
      validationMiddleware(UpdateProfileDTO),
      (req: Request, res: Response) =>
        this.userController.updateProfile(req, res)
    );
    this.router
      .route("/banner")
      .get((req: Request, res: Response) =>
        this.informationController.getAllBanners(req, res)
      );
    this.router
      .route("/services")
      .get(jwtMiddleware(), (req: Request, res: Response) =>
        this.informationController.getAllServices(req, res)
      );

    this.router
      .route("/balance")
      .get(jwtMiddleware(), (req: Request, res: Response) =>
        this.trxController.getBalance(req, res)
      );
  }
}
