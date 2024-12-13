const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");


const SteamGame = sequelize.define(
    'steam_game',
    {
        id:{ //PK 
            type: DataTypes.INTEGER,
            allowNull:false,
            primaryKey: true,
            autoIncrement: true,
        },
        title:{
            type: DataTypes.TEXT,
            allowNull:false
        }, 
        imageUrl:{
            type: DataTypes.TEXT,
            allowNull:true  
        },
        content_type_id:{            //тип продукта - длс,игра, саундтрек и тд
            type: DataTypes.INTEGER,
            allowNull:true
        },
        description:{
            type: DataTypes.TEXT,
            allowNull:true //*
        },
        status:{                     //доступна, не доступна, демо, ранний доступ
            type: DataTypes.TEXT, 
            allowNull:true
        },
        release_date:{
            type: DataTypes.TEXT, //починить, так как ругается на формат текста 
            allowNull:true //*
        },
        platform_id:{  //FK, **
            type: DataTypes.INTEGER,
            allowNull:false 
        },
        genres:{
            type: DataTypes.TEXT,
            allowNull:true //*
        },
        developer_id:{ //FK, **
            type: DataTypes.INTEGER,
            allowNull:true
        },
        publisher_id:{ //FK, **
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
        supported_OS:{ 
            type: DataTypes.TEXT,  //тут написано что должен быть VARCHAR(20) хз че это 
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
    },

);

const SteamPrice = sequelize.define(
    'steam_price',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        gameId: {
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
        gameId: {
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
        tableName:'steam_news'
    }
)

const EpicGame = sequelize.define(
    'epic_game',
    {
        id:{
            type: DataTypes.INTEGER,
            allowNull:false,
            primaryKey: true,
            autoIncrement: true,
        },
        title:{
            type: DataTypes.TEXT,
            allowNull:true
        }, 
        content_type_id:{            
            type: DataTypes.INTEGER,
            allowNull:true
        },
        description:{
            type: DataTypes.TEXT,
            allowNull:true
        },
        status:{                     
            type: "varchar(20)", 
            allowNull:true
        },
        release_date:{
            type: "varchar(50)", 
            allowNull:true
        },
        platform_id:{
            type: DataTypes.INTEGER,
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
            allowNull:true
        },
        supported_os:{ 
            type: "varchar(30)",
            allowNull:true
        },
        url:{
            type: DataTypes.TEXT,
            allowNull:true,
        },
    },
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
            allowNull: true
        },
        price: {
            type: "numeric(12,2)",
            allowNull: true
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
            allowNull: true
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: true
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
            autoIncrement: true
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        short_description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        url: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, 
    {
        tableName: "epic_news",
        timestamps: false,
    }
);

const Platform = sequelize.define(
    'platform', 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true 
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, 
    {
        timestamps: false
    }
);

const Developer = sequelize.define(
    'developer', 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, 
    {
        timestamps: false
    }
);

const Publisher = sequelize.define(
    'publisher', 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, 
    {
        timestamps: false
    }
);

const ContentType = sequelize.define(
    'content_type', 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: "varchar(30)",
            allowNull: true
        }
    }, 
    {
        timestamps: false
    }
);

SteamGame.belongsTo(Platform, { foreignKey: 'platform_id', targetKey: 'id' });
SteamGame.belongsTo(Developer, { foreignKey: 'developer_id', targetKey: 'id' });
SteamGame.belongsTo(Publisher, { foreignKey: 'publisher_id', targetKey: 'id' });
SteamGame.belongsTo(ContentType, { foreignKey: 'content_type_id', targetKey: 'id' });
SteamGame.hasOne(SteamTopGame, { foreignKey: 'gameId', sourceKey: 'id' });
SteamGame.hasOne(SteamPrice, { foreignKey: 'gameId', sourceKey: 'id' });

SteamPrice.belongsTo(SteamGame, { foreignKey: 'gameId', targetKey: 'id' });
SteamTopGame.belongsTo(SteamGame, { foreignKey: 'gameId', targetKey: 'id' });

EpicGame.belongsTo(Platform, { foreignKey: 'platform_id', targetKey: 'id' });
EpicGame.belongsTo(Developer, { foreignKey: 'developer_id', targetKey: 'id' });
EpicGame.belongsTo(Publisher, { foreignKey: 'publisher_id', targetKey: 'id' });
EpicGame.belongsTo(ContentType, { foreignKey: 'content_type_id', targetKey: 'id' });
EpicGame.hasOne(EpicPrice, { foreignKey: 'game_id' });
EpicGame.hasOne(EpicTopGame, { foreignKey: 'game_id' });

EpicPrice.belongsTo(EpicGame, { foreignKey: 'game_id', targetKey: 'id' });
EpicTopGame.belongsTo(EpicGame, { foreignKey: 'game_id', targetKey: 'id' });

Platform.hasMany(SteamGame, { foreignKey: 'platform_id' });
Platform.hasMany(EpicGame, { foreignKey: 'platform_id' });
Developer.hasMany(SteamGame, { foreignKey: 'developer_id' });
Developer.hasMany(EpicGame, { foreignKey: 'developer_id' });
Publisher.hasMany(SteamGame, { foreignKey: 'publisher_id' });
Publisher.hasMany(EpicGame, { foreignKey: 'publisher_id' });
ContentType.hasMany(SteamGame, { foreignKey: 'content_type_id' });
ContentType.hasMany(EpicGame, { foreignKey: 'content_type_id' });

module.exports = {SteamGame, SteamPrice, SteamTopGame, SteamNews, 
                  EpicGame, EpicPrice, EpicTopGame, EpicNews, 
                  Developer, Publisher, ContentType, Platform};