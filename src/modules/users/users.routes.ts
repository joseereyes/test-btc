import express from "express"
import { Users } from "./users.controller"
import {
    registerUser,
    validateLogin,
} from "./users.validationSchema"
import { Db } from "mongodb"

const router = express.Router();
const publicRouter = express.Router();

class UserRouter {

    public readonly routes: typeof router
    private readonly usersController: Users

    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        this.usersController = new Users({ mongoDatabase });
        
        publicRouter.post("/login", validateLogin(), this.usersController.login.bind(this.usersController))
        publicRouter.post("/register", registerUser(), this.usersController.register.bind(this.usersController))

        router.use("/public", publicRouter);
        
        this.routes = router;
    }
}


export default UserRouter