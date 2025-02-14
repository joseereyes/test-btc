
export interface IReturnPaginateBase {
    totalPages: number
    totalItems: number,
    currentPage: number
}

export interface IReturnPaginateDevices extends IReturnPaginateBase {
    list: IDevice[]
}

export interface IDevice {
    _id: number,
    type: "light" | "sensor" | "switch",
    data: {
        state: "on"  | "off" | number,
        attributes: {
            friendlyName: string,
            brightness?: number,
            ledColor?: string,
            unitOfMeasurement?: "CELSIUS" | "FARENHEIT"
        }
    },
    createdDate: Date
    createdBy: IBaseUser
    updatedDate?: Date
    updatedBy?: IBaseUser
    reportedDate?: Date
} 

export interface IGetDevicesQuery {
    page: number
    limit: number
    friendlyName?: string
    state?: "on"  | "off"
}

export interface IUser extends IBaseUser {
    email: string
    password?: string | null
    token? : string
}

export interface IBaseUser{
    _id: number;
    fullName: string
}