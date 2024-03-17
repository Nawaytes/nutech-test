import { Request, Response, Router } from "express";
import { UserController } from "../../controllers/user";
import { CreateUserDto } from "../../dto/user/postUser.dto";
import { validationMiddleware } from "../../middleware/validation.middleware";

export default class UserRouter {
  router: Router;
  userController: UserController;

  constructor() {
    this.userController = new UserController();
    this.router = Router({ mergeParams: true });
    this.serve();
  }

  private serve() {
    this.router
      .route("/detail/:id")
      .get((req: Request, res: Response) =>
        this.userController.detail(req, res)
      );
    this.router
      .route("")
      .post(
        validationMiddleware(CreateUserDto),
        (req: Request, res: Response) => this.userController.create(req, res)
      );

  }
}