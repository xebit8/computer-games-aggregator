const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");


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
            type: "varchar(10)",
            allowNull: true
        }
    }, 
    {
        timestamps: false
    }
);

EpicGame.belongsTo(Platform, { foreignKey: 'platform_id', targetKey: 'id' });
EpicGame.belongsTo(Developer, { foreignKey: 'developer_id', targetKey: 'id' });
EpicGame.belongsTo(Publisher, { foreignKey: 'publisher_id', targetKey: 'id' });
EpicGame.belongsTo(ContentType, { foreignKey: 'content_type_id', targetKey: 'id' });
EpicGame.hasOne(EpicPrice, { foreignKey: 'game_id' });
EpicGame.hasOne(EpicTopGame, { foreignKey: 'game_id' });

Platform.hasMany(EpicGame, { foreignKey: 'platform_id' });
Developer.hasMany(EpicGame, { foreignKey: 'developer_id' });
Publisher.hasMany(EpicGame, { foreignKey: 'publisher_id' });
ContentType.hasMany(EpicGame, { foreignKey: 'content_type_id' });

EpicPrice.belongsTo(EpicGame, { foreignKey: 'game_id', targetKey: 'id' });
EpicTopGame.belongsTo(EpicGame, { foreignKey: 'game_id', targetKey: 'id' });

module.exports = {EpicGame, EpicPrice, EpicTopGame, EpicNews, Developer, Publisher, ContentType, Platform};