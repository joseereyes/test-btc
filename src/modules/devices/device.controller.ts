
import { Request, Response } from "express"
import { DevicesService } from "./device.service";
import { Db } from "mongodb";
import { IDevice, IGetDevicesQuery, IUser } from "../../interfaces";

class Device {

    public readonly devicesService: DevicesService

    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        this.devicesService = new DevicesService({ mongoDatabase });
    }

    async createOne(req: Request, res: Response) {
        try {

            const { body }: { body: IDevice } = req
            const user: IUser = res.locals.user

            const response = await this.devicesService.createOne({ body: body, user: user });

            res.status(200).json({
                success: true,
                data: response,
                message: "Se ha agregado el dispositivo de forma exitosa."
            })

        } catch (error: any) {

            res.status(510).json({
                success: false,
                data: null,
                message: "Ha ocurrido un error al agregar el dispositivo."
            })

        }
    }

    async updateOne(req: Request, res: Response) {
        try {

            const _id = req.params._id as unknown as number
            const { body }: { body: IDevice } = req
            const user: IUser = res.locals.user

            const response = await this.devicesService.updateOne({ _id, body, user });

            res.status(200).json({
                success: true,
                data: response,
                message: "Se ha actualizado el dispositivo de forma exitosa."
            })

        } catch (error: any) {

            res.status(510).json({
                success: false,
                data: null,
                message: "Ha ocurrido un error al actualizar el dispositivo."
            })

        }
    }

    async deleteOne(req: Request, res: Response) {
        try {

            const _id = req.params._id as unknown as number

            const response = await this.devicesService.collection.deleteOne({_id: _id})
            
            res.status(200).json({
                success: true,
                data: response,
                message: "Se ha eliminado de forma exitosa el dispositivo."
            })

        } catch (error: any) {

            res.status(510).json({
                success: false,
                data: null,
                message: "Ha ocurrido un error al eliminar el dispositivo."
            })

        }
    }

    async find(req: Request, res: Response) {
        try {

            const query  = req.query as unknown as IGetDevicesQuery

            const response = await this.devicesService.findAll(query);

            res.status(200).json({
                success: true,
                data: response,
                message: "Se ha obtenido de forma exitosa el listado de dispositivos."
            })

        } catch (error: any) {

            res.status(510).json({
                success: false,
                data: null,
                message: "Ha ocurrido un error al obtener el listado de dispositivos."
            })

        }
    }

}

export { Device };
