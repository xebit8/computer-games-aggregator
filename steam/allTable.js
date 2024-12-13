const {sequelize} = require('/Users/mac/Ohhhh_secret/game_project_JS /general/connect.js')
const { DataTypes} = require("sequelize");

//PK (primary key - первичный ключ)
//FK - foreign key(внешний ключ)
//AK - alternative key(альтернативный ключ)

//* - по идее не будет пустых, но на всякий случай 

//** - будет браться с других таблиц, которые будут заполнятся парсером 

const Steam_games = sequelize.define(
    'steam_games',
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
        url:{ //AK
            type: DataTypes.TEXT,
            allowNull:true,
            unique: true //значение будет уникальным 
        },
    },

);

const News = sequelize.define(
    'news',
    {
        title: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        url: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        text:{
            type: DataTypes.TEXT,
            allowNull: true,
        }
    },
    {
        tableName:'news'
    }
)

//связь с таблицей platforms
const Platform = sequelize.define(
    'platforms', 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true //генерация уникальных значений 
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
Steam_games.belongsTo(
    Platform, 
    {
        foreignKey: 'platform_id',
        targetKey: 'id'
    }
);

const Content_type = sequelize.define(
    'content_types',
    {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true //генерация уникальных значений 
        },
        type: {
            type: DataTypes.TEXT,
            allowNull: true
        }

    }
)

Steam_games.belongsTo(
    Content_type,
    {
        foreignKey:'content_type_id',
        targetKey: 'id'
    }
)

//связь с таблицей developers
const Developer = sequelize.define(
    'developers', 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true //генерация уникальных значений 
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
Steam_games.belongsTo(
    Developer, 
    {
        foreignKey: 'developer_id',
        targetKey: 'id'
    }
);

//связь с таблицей publishers
const Publisher = sequelize.define(
    'publishers', 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true //генерация уникальных значений 
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
Steam_games.belongsTo(
    Publisher, 
    {
        foreignKey: 'publisher_id',
        targetKey: 'id'
    }
);

const Steam_prices = sequelize.define(
    'steam_prices',
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
                model: Steam_games,
                key: 'id'
            }
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: true
        }
    }
);

// Установка связей таблиц игры - цены игр
Steam_prices.belongsTo(Steam_games, {
    foreignKey: 'gameId',
    targetKey: 'id'
});

Steam_games.hasMany(Steam_prices, {
    foreignKey: 'gameId',
    sourceKey: 'id'
});

const Steam_top_sellers = sequelize.define(
    'steam_top_sellers',
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
                model: Steam_games,
                key: 'id'
            }
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }
)

// Установка связей таблиц игры - лидеры продаж
Steam_top_sellers.belongsTo(Steam_games, {
    foreignKey: 'gameId',
    targetKey: 'id'
});

Steam_games.hasMany(Steam_top_sellers, {
    foreignKey: 'gameId',
    sourceKey: 'id'
});

module.exports = {Steam_games,Platform,Developer,Publisher,Content_type,Steam_prices,Steam_top_sellers,News}