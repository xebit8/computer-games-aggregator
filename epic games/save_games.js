const sequelize = require("../general/sequelize");
const { EpicGame, EpicPrice, EpicTopGame, EpicNews, ContentType, Developer, Platform, Publisher } = require("../general/models");
const fetchAllGames = require("./parse.js");
const fetchTopGames = require("./parse_top_games.js");
const fetchNews = require("./parse_news.js");


(async function saveToDatabase() {
    try {
        await sequelize.authenticate();
        console.log("[Epic Games] Successfully connected to database!");

        const games = await fetchAllGames();
        const topGames = await fetchTopGames();
        const news = await fetchNews();
        console.log("[Epic Games] Data was successfully scraped!");

        const developers = new Map();
        const publishers = new Map();
        const contentTypes = new Map();
        const platforms = new Map();

        for (let game of games)
        {
            if (!developers.has(game.developer)) {
                await fillDevelopers(developers, game);
            }
            if (!publishers.has(game.publisher)) {
                await fillPublishers(publishers, game);
            }
            if (!contentTypes.has(game.content_type)) {
                await fillContentTypes(contentTypes, game);
            }
            if (!platforms.has(game.platform)) {
                await fillPlatforms(platforms, game);
            }
        }

        for (let game of games) {
            if (game.status === "-") 
            {
                
                continue;
            }
            await fillGames(game, developers, publishers, contentTypes, platforms);
        }

        for (let i = 0; i < games.length; i++) {
            await fillPrices(games[i], i+1);
        }

        for (let topGame of topGames) {
            const game_id = games.findIndex(game => game.title === topGame.title);
            if (game_id === -1) continue;
            await fillTopGames(topGame, game_id);
        }

        for (let news_chunk of news) {
            await fillNews(news_chunk);
        }
        

    } catch (error) {
        console.error("Error!", error);
    }
})();

async function fillDevelopers(developers, element) {
    try {
        developers.set(element.developer, developers.size+1);
        await Developer.create({"name": element.developer});

    } catch (error) {
        console.error("Error!", error);
    }
}; 

async function fillPublishers(publishers, element) {
    try {
        publishers.set(element.publisher, publishers.size+1);
        await Publisher.create({"name": element.publisher});

    } catch (error) {
        console.error("Error!", error);
    }
}; 

async function fillContentTypes(contentTypes, element) {
    try {
        contentTypes.set(element.content_type, contentTypes.size+1);
        await ContentType.create({"name": element.content_type});

    } catch (error) {
        console.error("Error!", error);
    }
}; 

async function fillPlatforms(platforms, element) {
    try {
        platforms.set(element.platform, platforms.size+1);
        await Platform.create({"name": element.platform});

    } catch (error) {
        console.error("Error!", error);
    }
}; 

async function fillGames(element, developers, publishers, contentTypes, platforms) {
    try {
        await EpicGame.create({
            "title": element.title,
            "content_type_id": contentTypes.get(element.content_type),
            "description": element.description,
            "status": element.status,
            "release_date": element.release_date,
            "platform_id": platforms.get(element.platform),
            "genres": element.genres,
            "developer_id": developers.get(element.developer),
            "publisher_id": publishers.get(element.publisher),
            "supported_os": element.supported_os,
            "url": element.url,
        });
        //console.log(element);
    } catch (error) {
        console.error("Error!", error);
    }
}

async function fillPrices(element, index) {
    try {
        await EpicPrice.create({
            "game_id": index,
            "price": element.price,
        });
    } catch (error) {
        console.error("Error!", error);
    }
}

async function fillTopGames(element, game_id) {
    try {
        await EpicTopGame.create({
            "game_id": game_id,
            "position": element.position,
        });
    } catch (error) {
        console.error("Error!", error);
    }
}

async function fillNews(element) {
    try {
        await EpicNews.create({
            "title": element.title,
            "short_description": element.short_description,
            "url": element.url,
        });
    } catch (error) {
        console.error("Error!", error);
    }
}



