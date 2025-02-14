import Database from "./database";
import { EnvironmentConfig } from "./enviroment";

const environmentConfig : EnvironmentConfig = new EnvironmentConfig();
const database : typeof Database = Database;

export {environmentConfig,EnvironmentConfig}
export {database,Database}






















