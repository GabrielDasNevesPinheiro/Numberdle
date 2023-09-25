import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import sequelize from '../Connection';

class Guild extends Model<InferAttributes<Guild>, InferCreationAttributes<Guild>> {

    declare guildId: string;
    declare defaultChannel: CreationOptional<string>;

}

Guild.init({
    guildId: {
        type: new DataTypes.STRING(24),
        primaryKey: true
    },
    defaultChannel: {
        type: new DataTypes.STRING(24),
    }
}, {
    sequelize,
    tableName: "guilds",
});

export default Guild;