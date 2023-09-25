import { Sequelize } from "sequelize-typescript";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './src/database/db/database.sqlite'
});

export default sequelize;