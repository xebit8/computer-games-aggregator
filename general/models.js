const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");


const SteamGame = sequelize.define(
    'steam_game',
    {
        id:{
            type: DataTypes.INTEGER,
            allowNull:false,
            primaryKey: true,
            autoIncrement: true,
        },
        title:{
            type: DataTypes.TEXT,
            allowNull:false
        }, 
        content_type:{            
            type: "content_type",
            allowNull: false,
        },
        description:{
            type: DataTypes.TEXT,
            allowNull:true
        },
        status:{                     
            type: "status",
            allowNull: false,
        },
        release_date:{
            type: DataTypes.TEXT, 
            allowNull:true
        },
        genres:{
            type: DataTypes.TEXT,
            allowNull:true
        },
        developer_id:{
            type: DataTypes.INTEGER,
            allowNull:true
        },
        publisher_id:{
            type: DataTypes.INTEGER,
            allowNull:false
        },
        min_system_requirements:{
            type: DataTypes.TEXT,
            allowNull:true
        },
        recommended_system_requirements:{
            type: DataTypes.TEXT,
            allowNull:true
        },
        supported_os:{ 
            type: DataTypes.TEXT,
            allowNull:false
        },
        supported_languages:{
            type: DataTypes.TEXT,
            allowNull:true
        },
        url:{
            type: DataTypes.TEXT,
            allowNull:true,
        },
        image_url:{
            type: DataTypes.TEXT,
            allowNull:true  
        },
    },
    {
        timestamps: false,
    }

);

const SteamPrice = sequelize.define(
    'steam_price',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        game_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: SteamGame,
                key: 'id'
            }
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: true
        }
    },
    {
        timestamps: false,
    }
);

const SteamTopGame = sequelize.define(
    'steam_top_game',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        game_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: SteamGame,
                key: 'id'
            }
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        timestamps: false,
    }
)

const SteamNews = sequelize.define(
    'steam_news',
    {
        title: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        text:{
            type: DataTypes.TEXT,
            allowNull: true,
        },
        url: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName:'steam_news',
        timestamps: false,
    }
)

const EpicGame = sequelize.define(
    'epic_game',
    {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title:{
            type: DataTypes.TEXT,
            allowNull: false,
        }, 
        content_type:{            
            type: "content_type",
            allowNull: false,
        },
        description:{
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status:{                     
            type: "status",
            allowNull: false,
        },
        release_date:{
            type: "varchar(50)", 
            allowNull: false,
        },
        genres:{
            type: DataTypes.TEXT,
            allowNull: false,
        },
        developer_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        publisher_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        supported_os:{ 
            type: "varchar(30)",
            allowNull: true,
        },
        image_url: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        url:{
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        timestamps: false,
    }
);

const EpicPrice = sequelize.define(
    'epic_price', 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        game_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: "numeric(12,2)",
            allowNull: false,
        }
    },
    {
        timestamps: false,
    }
);

const EpicTopGame = sequelize.define(
    'epic_top_game', 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        game_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        timestamps: false,
    }
);

const EpicNews = sequelize.define(
    'epic_news', 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        short_description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        url: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    }, 
    {
        tableName: "epic_news",
        timestamps: false,
    }
);

const Developer = sequelize.define(
    'developer', 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    },
    {
        timestamps: false,
    }
);

const Publisher = sequelize.define(
    'publisher', 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    },
    {
        timestamps: false,
    }
);

const Favourite = sequelize.define(
    'favourite', 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        game_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        platform:{
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

const GamesLog = sequelize.define(
    'games_log',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        game_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        platform:{
            type: DataTypes.TEXT,
            allowNull: false,
        },
        event_type: {
            type: "event_type",
            allowNull: false,
        },
        event_time: {
            type: "timestamp",
            defaultValue: sequelize.literal("now()::Date"),
            allowNull: false,
        }
    },
    {
        timestamps: false,
    }
)

SteamGame.belongsTo(Developer, { foreignKey: 'developer_id', targetKey: 'id' });
SteamGame.belongsTo(Publisher, { foreignKey: 'publisher_id', targetKey: 'id' });
SteamGame.hasOne(SteamTopGame, { foreignKey: 'game_id', sourceKey: 'id' });
SteamGame.hasOne(SteamPrice, { foreignKey: 'game_id', sourceKey: 'id' });
SteamGame.hasOne(Favourite, { foreignKey: 'game_id', sourceKey: 'id' });
SteamGame.hasOne(GamesLog, { foreignKey: 'game_id', sourceKey: 'id' });

SteamPrice.belongsTo(SteamGame, { foreignKey: 'game_id', targetKey: 'id' });
SteamTopGame.belongsTo(SteamGame, { foreignKey: 'game_id', targetKey: 'id' });

EpicGame.belongsTo(Developer, { foreignKey: 'developer_id', targetKey: 'id' });
EpicGame.belongsTo(Publisher, { foreignKey: 'publisher_id', targetKey: 'id' });
EpicGame.hasOne(EpicPrice, { foreignKey: 'game_id' });
EpicGame.hasOne(EpicTopGame, { foreignKey: 'game_id' });
EpicGame.hasOne(Favourite, { foreignKey: 'game_id', sourceKey: 'id' });
EpicGame.hasOne(GamesLog, { foreignKey: 'game_id', sourceKey: 'id' });

EpicPrice.belongsTo(EpicGame, { foreignKey: 'game_id', targetKey: 'id' });
EpicTopGame.belongsTo(EpicGame, { foreignKey: 'game_id', targetKey: 'id' });

Developer.hasMany(SteamGame, { foreignKey: 'developer_id' });
Developer.hasMany(EpicGame, { foreignKey: 'developer_id' });
Publisher.hasMany(SteamGame, { foreignKey: 'publisher_id' });
Publisher.hasMany(EpicGame, { foreignKey: 'publisher_id' });

Favourite.belongsTo(SteamGame, { foreignKey: 'game_id', targetKey: 'id' });
Favourite.belongsTo(EpicGame, { foreignKey: 'game_id', targetKey: 'id' });

GamesLog.belongsTo(SteamGame, { foreignKey: 'game_id', targetKey: 'id' });
GamesLog.belongsTo(EpicGame, { foreignKey: 'game_id', targetKey: 'id' });


module.exports = {SteamGame, SteamPrice, SteamTopGame, SteamNews, 
                  EpicGame, EpicPrice, EpicTopGame, EpicNews, 
                  Developer, Publisher, Favourite, GamesLog};