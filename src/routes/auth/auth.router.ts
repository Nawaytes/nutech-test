import { Request, Response, Router } from "express";
import { AuthController } from "../../controllers/auth.controller";
import { validationMiddleware } from "../../middleware/validation.middleware";
import { LoginDto } from "../../dto/auth/login.dto";

export default class AuthRouter {
  authController: AuthController;
  router: Router;

  constructor() {
    this.authController = new AuthController();
    this.router = Router({ mergeParams: true });
    this.serve();
  }

  private serve() {
    this.router
      .route("/login")
      .post(validationMiddleware(LoginDto), (req: Request, res: Response) =>
        this.authController.login(req, res)
      );
  }
}
