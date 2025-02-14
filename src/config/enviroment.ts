import dotenv from 'dotenv';
dotenv.config();

class EnvironmentConfig {
    public readonly SERVICE_PORT: number;

    public readonly DB_NAME: string;
    public readonly DB_USER: string;
    public readonly DB_PASSWORD: string;
    public readonly DB_HOST: string;
    public readonly DB_PORT: number;


    constructor() {

        this.SERVICE_PORT = Number(process.env.SERVICE_PORT || 8000);

        this.DB_NAME = process.env.DB_NAME || 'BCT_TEST';
        this.DB_USER = process.env.DB_USER || 'root';
        this.DB_PASSWORD = process.env.DB_PASSWORD || 'bananapi';
        this.DB_HOST = process.env.DB_HOST || 'localhost';
        this.DB_PORT = Number(process.env.DB_PORT) || 27017;

    }
}

export { EnvironmentConfig };
