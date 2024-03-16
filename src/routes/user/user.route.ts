import { Request, Response, Router } from "express";
import { UserController } from "../../controllers/user";
import { createUserValidation } from "../../helper/validator/postUser.validator";

export default class UserRouter {
    router: Router;
    userController: UserController;

    constructor() {
        this.userController = new UserController();
        this.router = Router({ mergeParams: true });
        this.serve()
    }

    private serve() {
        this.router.route("").post(createUserValidation(), (req: Request, res: Response) =>
            this.userController.create(req, res)
        )
    }
}