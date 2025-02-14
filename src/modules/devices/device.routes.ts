import express from "express"
import { Device } from "./device.controller"
import { validateDevice,getDeviceQuery,updateDevice,deleteDevice} from "./device.validationSchema"
import { Db } from "mongodb"
import BaseService from "../../base/baseService"

const router = express.Router();


class DeviceRouter {

    public readonly routes: typeof router
    private readonly deviceController: Device
    private readonly baseService: BaseService

    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        this.deviceController = new Device({ mongoDatabase });
        this.baseService = new BaseService({ mongoDatabase, tableName: "USERS" });

        router.use("/private", this.baseService.verifyToken.bind(this.baseService));
        
        router.post("/private/create",validateDevice(), this.deviceController.createOne.bind(this.deviceController));
        router.put("/private/update/:_id", updateDevice(),this.deviceController.updateOne.bind(this.deviceController));
        router.get("/private/find", getDeviceQuery(),this.deviceController.find.bind(this.deviceController));
        router.delete("/private/delete/:_id", deleteDevice(),this.deviceController.deleteOne.bind(this.deviceController));

        router.use("/private", router);
        this.routes = router;
    }
}

export default DeviceRouter