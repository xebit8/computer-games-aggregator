const sequelize = require("../general/sequelize");
const { EpicGame, EpicPrice, EpicTopSeller, Content_type, Developer, Platform, Publisher } = require("../general/models");
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

        games.forEach((element, index) => {
            developers.get(element.developer) || fillDevelopers(developers, element, index);
            publishers.get(element.publisher) || fillPublishers(publishers, element, index);
            contentTypes.get(element.content_type) || fillContentTypes(contentTypes, element, index);
            platforms.get(element.platform) || fillPlatforms(platforms, element, index);
        });

        games.forEach((element) => {
            fillGames(element, developers, publishers, contentTypes, platforms);
        });

        games.forEach((element, index) => {
            prices.get(element.price) || fillPrices(prices, element, index)
        })
        
        

    } catch (error) {
        console.error("Error!", error);
    }
});

// function arrayToUniqueEnumArray(data) {
//     const uniques = new Set(data);
//     const enumeratedArray = Array.from(uniques).map((value, index) => ({index, value}));
//     return enumeratedArray;
// };

async function fillDevelopers(developers, element, index) {
    try {
        developers.set(element.developer, index);
        await Developer.create({"name": element.developer});

    } catch (error) {
        console.error("Error!", error);
    }
}; 

async function fillPublishers(publishers, element, index) {
    try {
        publishers.set(element.publisher, index);
        await Publisher.create({"name": element.publisher});

    } catch (error) {
        console.error("Error!", error);
    }
}; 

async function fillContentTypes(contentTypes, element, index) {
    try {
        contentTypes.set(element.content_type, index);
        await Content_type.create({"name": element.content_type});

    } catch (error) {
        console.error("Error!", error);
    }
}; 

async function fillPlatforms(platforms, element, index) {
    try {
        platforms.set(element.platform, index);
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
    } catch {
        console.error("Error!", error);
    }
}

async function fillPrices(prices, element, index) {
    try {
        prices.set(index, element.price);
        await EpicPrice.create({
            "game_id": index,
            "price": element.price,
        });
    } catch {
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


