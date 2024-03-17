import { Request, Response, Router } from "express";
import { UserController } from "../../controllers/user";
import { createUserValidation } from "../../helper/validator/postUser.validator";
import { validationMiddleware } from "../../middleware/validation.middleware";
import { CreateUserDto } from "../../dto/user/postUser.dto";

export default class UserRouter {
  router: Router;
  userController: UserController;

  constructor() {
    this.userController = new UserController();
    this.router = Router({ mergeParams: true });
    this.serve();
  }

  private serve() {
    this.router.route("").post(
      // createUserValidation()
      validationMiddleware(CreateUserDto),
      (req: Request, res: Response) => this.userController.create(req, res)
    );
  }
}