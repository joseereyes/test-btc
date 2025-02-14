import { Db, Collection } from "mongodb";
import { EnvironmentConfig, environmentConfig } from "../config";
import jwt from 'jsonwebtoken';
import { NextFunction, Response, Request } from "express";
import { IUser } from "../interfaces";


class BaseService {
    public readonly tableName: string
    public readonly collection: Collection | any;
    public readonly mongoDatabase: Db | any;
    public readonly environmentConfig: EnvironmentConfig
    public readonly JWT_SECRET_KEY

    constructor({ mongoDatabase, tableName }: { mongoDatabase: Db, tableName: string }) {
        this.JWT_SECRET_KEY = "JOSEPH-JOESTAR22@L."
        this.tableName = tableName
        this.environmentConfig = environmentConfig
        this.mongoDatabase = mongoDatabase;
        this.collection = mongoDatabase.collection(this.tableName)
    }

    async verifyToken(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                throw new Error("El usuario no se ha autenticado de forma correcta.");
            }

            const user = jwt.verify(token, this.JWT_SECRET_KEY) as IUser;
            const userOnDb = await this.mongoDatabase.collection("USERS").findOne({ _id: user._id });
            res.locals.user = userOnDb; // Asigna el usuario decodificado a req.user
            next();
        } catch (error: any) {
            res.status(401).json({
                success: false,
                data: null,
                message: error?.message || "El usuario no se ha autenticado de forma correcta."
            });
        }
    }

    generateToken(body: any) {
        try {

            const token = jwt.sign(body, this.JWT_SECRET_KEY);
            return token

        } catch (error) {
            throw new Error("Ha ocurrido un error al generar el token.")
        }
    }

    async insertOne({ body, user }: { body: any, user?: IUser }): Promise<any> {

        try {
            let object = { ...body };
            object._id = await this.getSequence();
            object.createdDate = new Date();
            if (user) {
                object.createdBy = {
                    _id: user._id,
                    fullName: user.fullName
                }
            } else {
                object.createdBy = {
                    _id:  object._id,
                    fullName: object.fullName
                }
            }
            await this.collection.insertOne(object)
            return object
        } catch (error) {
            throw error
        }
    }

    async getSequence(): Promise<Number> {
        const collection = this.tableName;

        try {

            const sequenceCollection = this.mongoDatabase.collection('SEQUENCE');

            // Buscar el documento de secuencia para la colección dada
            let sequenceDoc = await sequenceCollection.findOne({ collection });

            if (sequenceDoc) {
                const current_value = sequenceDoc.sequence_value;
                const new_value = current_value + 1;

                // Actualizar el documento con el nuevo valor de secuencia
                await sequenceCollection.updateOne(
                    { collection },
                    { $set: { sequence_value: new_value } }
                );

                return new_value;
            } else {
                // Insertar un nuevo documento si no se encuentra
                const newSequence = { collection, sequence_value: 1 };
                await sequenceCollection.insertOne(newSequence);

                return newSequence.sequence_value;
            }
        } catch (error) {
            throw error; // Propaga el error para que sea manejado fuera de la función
        }
    }

    async paginate(query: any[], page= 1,limit=10,collection?: Collection<Document>){
        try {

            const skip = (page - 1) * limit;

            const aggCount = [
                ...query,
                {
                    "$group": {
                        "_id": null,
                        "totalCount": { "$sum": 1 }
                    }
                },
                { "$project": { "_id": 0, "count": "$totalCount" } }
            ];

            const currentCollection = collection || this.collection;
            const resultCount = await currentCollection.aggregate(aggCount, { allowDiskUse: true }).toArray();

            query.push({ "$skip": skip });
            query.push({ "$limit": limit });

            const result = await currentCollection.aggregate(query).toArray();

            const totalItems = resultCount.length > 0 ? resultCount[0]["count"] : 0;
            const totalPages = totalItems > 0 ? Math.ceil(totalItems / limit) : 1;

            return {
                totalPages: totalPages,
                list: result,
                currentPage: totalPages > 1 ? page : totalPages,
                totalItems: totalItems
            };
        } catch (error) {
            throw new Error(`Error paginating query: ${error}`);
        }
    }

    diacriticSensitive(text:string) {
        const diacriticMap: { [key: string]: string } = {
            'a': '[aá]',
            'e': '[eé]',
            'i': '[ií]',
            'o': '[oó]',
            'u': '[uúü]'
        };
        return text.toLowerCase().replace(/[aeiou]/g, match => diacriticMap[match] || match);
    }
}

export default BaseService;
