
import { Request, Response } from "express"
import { UsersService } from "./users.service";
import {  IUser } from "../../interfaces";
import { Db } from "mongodb";

class Users {

    public readonly usersService: UsersService

    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        this.usersService = new UsersService({ mongoDatabase });
    }

    async login(req: Request, res: Response) {
        try {

            const { username, password }: { username: string, password: string } = req.body;

            const response = await this.usersService.login({ username, password });

            res.status(200).json({
                success: true,
                data: response,
                message: "Se ha autenticado de forma exitosa."
            })

        } catch (error: any) {

            res.status(510).json({
                success: false,
                data: null,
                message: error?.message || "Ha ocurrido un error al autenticar sus credenciales."
            })

        }
    }

    async register(req: Request, res: Response) {

        try {

            const userToRegister: IUser = req.body;

            const response = await this.usersService.register(userToRegister);

            res.status(200).json({
                success: true,
                data: response,
                message: "Felicidades, te has registrado correctamente."
            })

        } catch (error: any) {

            res.status(510).json({
                success: false,
                data: null,
                message: error?.message || "Ha ocurrido un error al registrarte en nuestra pagina web. por favor llámanos!"
            })

        }

    }
}

export { Users };