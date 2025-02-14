import express from "express"
import { Db } from "mongodb"

import UserRouter  from "./modules/users/users.routes"
import DeviceRouter from "./modules/devices/device.routes"

const router = express.Router()

class RouterApp{

    public readonly routes: typeof router;

    constructor({mongoDatabase}: {mongoDatabase: Db}){
        router.use("/users",new UserRouter({mongoDatabase}).routes);
        router.use("/devices",new DeviceRouter({mongoDatabase}).routes);
        this.routes = router
    }

}

export default RouterApp