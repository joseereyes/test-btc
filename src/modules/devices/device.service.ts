import BaseService from "../../base/baseService";
import { Db } from "mongodb";
import { UsersService } from "../users/users.service";
import { IDevice, IGetDevicesQuery, IReturnPaginateDevices, IUser } from "../../interfaces";

class DevicesService extends BaseService {

    userService: UsersService
    adminService: BaseService

    constructor({ mongoDatabase }: { mongoDatabase: Db }) {
        super({ mongoDatabase, tableName: "DEVICES" });
        this.userService = new UsersService({ mongoDatabase })
        this.adminService = new BaseService({ mongoDatabase, tableName: "ADMIN" })
    }


    async createOne({ body, user }: { body: IDevice, user: IUser }): Promise<IDevice> {

        try {

            body.reportedDate = new Date();
            const response = await this.insertOne({ body, user })
            return response
        } catch (error) {

            throw error;

        }
    }

    async updateOne({ body, _id, user }: { body: IDevice, _id: number, user: IUser }): Promise<IDevice> {

        try {
            body.updatedBy = {
                _id: user._id,
                fullName: user.fullName
            }
            body.updatedDate = new Date();
            const response = await this.collection.findOneAndUpdate({ _id: _id }, { $set: body }, { returnDocument: 'after' })
            return response
        } catch (error) {

            throw error;

        }
    }

    async findAll(filter: IGetDevicesQuery): Promise<IReturnPaginateDevices> {

        try {

            let match: any = {}
            let query = [{
                $match: match
            }];

            if (filter.friendlyName) {
                match["data.attributes.friendlyName"] = { $regex: this.diacriticSensitive(filter.friendlyName), $options: "i" }
            }

            if (filter.state) {
                match["data.state"] = filter.state
            }

            const response = await this.paginate(query, filter.page, filter.limit)
            return response

        } catch (error) {
            throw error;
        }
    }

}

export { DevicesService } 