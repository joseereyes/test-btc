import {IUser} from "../../interfaces";
import bcrypt from "bcrypt"
import BaseService from "../../base/baseService";
import { Db } from "mongodb";

class UsersService extends BaseService {


    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        super({ mongoDatabase, tableName: "USERS" });
    }

    
    /**
     * Realiza el inicio de sesión de un usuario.
     * @param {string} username - El correo del usuario.
     * @param {string} password - La clave del usuario.
     * @returns {Promise<IUser>} - La promesa que se resuelve con el usuario autenticado.
     * @throws {Error} - En caso de que el usuario no exista o la clave no coincida.
     */
    async login({ username, password }: { username: string, password: string }): Promise<IUser> {

        try {

            const user = await this.collection.findOne({ email: username })

            if (!user) {
                throw new Error("No existe un usuario con el correo: " + username);
            }

            const passwordMatch = await this.verifyPassword({ password, hash: user.password! });

            if (!passwordMatch) {
                throw new Error("La clave no coincide por favor verifique e intente de nuevo.");
            }

            delete user.password
            user.token = this.generateToken(user);

            return user


        } catch (error: any) {
            throw new Error(error?.message || "Ha ocurrido un error al autenticar tu usuario.");
        }
    }

    /**
     * Registra un nuevo usuario.
     * @param {IUser} userToRegister - El usuario que se va a registrar.
     * @returns {Promise<IUser>} - Una promesa que resuelve con el usuario registrado.
     */
    async register(userToRegister: IUser): Promise<IUser> {
        try {

            const exists = await this.collection.findOne({ email: userToRegister.email }, { projection: { _id: 1 } });

            if (exists) {
                throw new Error("Existe una cuenta con el correo: " + userToRegister.email);
            }

            userToRegister.password = await this.hashPasword(userToRegister.password!);
            
            await this.insertOne({ body: userToRegister });
            delete userToRegister.password;
            return userToRegister

        } catch (error) {
            throw error
        }
    }

    async hashPasword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash
    }


    async verifyPassword({ password, hash }: { password: string, hash: string }) {

        try {

            return await bcrypt.compare(password, hash);

        } catch (error) {
            throw new Error("Ha ocurrido un error al verificar la clave.")
        }
    }

}

export { UsersService } 