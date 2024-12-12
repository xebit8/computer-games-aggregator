const sequelize = require("../general/sequelize");
const { EpicGame, EpicPrice, EpicTopSeller, ContentType, Developer, Platform, Publisher } = require("../general/models");
const fetchAllGames = require("./parse.js");


(async function saveToDatabase() {
    try {
        await sequelize.authenticate();
        console.log("[Epic Games] Successfully connected to database!");

        const games = await fetchAllGames();
        console.log("[Epic Games] Data was successfully scraped!");

        const developers = new Map();
        const publishers = new Map();
        const contentTypes = new Map();
        const platforms = new Map();
        const prices = new Map();

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
            await fillGames(game, developers, publishers, contentTypes, platforms);
        }

        for (let i = 0; i < games.length; i++) {
            await fillPrices(games[i], i+1);
        }
        

    } catch (error) {
        console.error("Error!", error);
    }
})();

// function arrayToUniqueEnumArray(data) {
//     const uniques = new Set(data);
//     const enumeratedArray = Array.from(uniques).map((value, index) => ({index, value}));
//     return enumeratedArray;
// };

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
            "min_system_requirements": element.min_system_requirements,
            "recommended_system_requirements": element.recommended_system_requirements,
            "supported_os": element.supported_os,
            "supported_languages": element.supported_languages,
            "url": element.url,
        });
        //console.log(element, publishers.get(element.publisher));
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

// async function fillTopSellers() {
//     try {
//         await EpicTopSeller.create({
//             "game_id": null,
//             "position": null,
//         });
//     } catch {
//         console.error("Error!", error);
//     }
// }


