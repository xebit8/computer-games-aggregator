const sequelize = require("../general/sequelize");
const { EpicGame, EpicPrice, EpicTopGame, EpicNews, Developer, Publisher } = require("../general/models");
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

        for (let game of games)
        {
            if (!developers.has(game.developer)) {
                await fillDevelopers(developers, game);
            }
            if (!publishers.has(game.publisher)) {
                await fillPublishers(publishers, game);
            }
        }

        for (let game of games) {
            if (game.status === "-" | game.status == null) continue;
            await fillGames(game, developers, publishers);
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
        const elementFromDB = await Developer.findOne({ raw: true, where: { name: element.developer } });
        const data = { "name": element.developer };
        if (!elementFromDB) await Developer.create(data);
        else await Developer.update(data, { where: { id: elementFromDB.id } });

    } catch (error) {
        console.error("Error!", error);
    }
}; 

async function fillPublishers(publishers, element) {
    try {
        publishers.set(element.publisher, publishers.size+1);
        const elementFromDB = await Publisher.findOne({ raw: true, where: { name: element.publisher } });
        const data = { "name": element.publisher };
        if (!elementFromDB) await Publisher.create(data);
        else await Publisher.update(data, { where: { id: elementFromDB.id } });
        

    } catch (error) {
        console.error("Error!", error);
    }
}; 

async function fillGames(element, developers, publishers) {
    try {
        const elementFromDB = await EpicGame.findOne({ raw: true, where: { title: element.title } });
        const data = {
            "title": element.title,
            "content_type": element.content_type,
            "description": element.description,
            "status": element.status,
            "release_date": element.release_date,
            "genres": element.genres,
            "developer_id": developers.get(element.developer),
            "publisher_id": publishers.get(element.publisher),
            "supported_os": element.supported_os,
            "image_url": element.image_url,
            "url": element.url,
        };
        if (!elementFromDB) await EpicGame.create(data);
        else await EpicGame.update(data, { where: { id: elementFromDB.id } });
    } catch (error) {
        console.error("Error!", error);
    }
}

async function fillPrices(element, game_id) {
    try {
        const elementFromDB = await EpicPrice.findOne({ raw: true, where: { game_id: game_id } });
        const data = {
            "game_id": game_id,
            "price": element.price,
        };
        if (!elementFromDB) await EpicPrice.create(data);
        else await EpicPrice.update(data, { where: { game_id: elementFromDB.game_id } });
        
    } catch (error) {
        console.error("Error!", error);
    }
}

async function fillTopGames(element, game_id) {
    try {
        const elementFromDB = await EpicTopGame.findOne({ raw: true, where: { game_id: game_id } });
        const data = {
            "game_id": game_id,
            "position": element.position,
        };
        if (!elementFromDB) await EpicTopGame.create(data);
        else await EpicTopGame.update(data, { where: { game_id: elementFromDB.game_id } });
        
    } catch (error) {
        console.error("Error!", error);
    }
}

async function fillNews(element) {
    try {
        const elementFromDB = await EpicNews.findOne({ raw: true, where: { title: element.title } });
        const data = {
            "title": element.title,
            "short_description": element.short_description,
            "url": element.url,
        };
        if (!elementFromDB) await EpicNews.create(data);
        else await EpicNews.update(data, { where: { id: elementFromDB.id }});
    } catch (error) {
        console.error("Error!", error);
    }
}



