const sequelize = require('../general/sequelize')
const {infoForTableGame,infoForTablePrice} = require('./parserSteam.js')
const {parseTopGames} = require('./chartGameSteam.js')
const { SteamGame, Platform, Developer, Publisher, ContentType, SteamPrice, SteamTopGame } = require('../general/models')

async function connectSteamGames() {
    try {
        await sequelize.authenticate()
        console.log('---подключение есть---')

        //await sequelize.sync({ force: true })

        const gamesData = await infoForTableGame();
        const pricesData = await infoForTablePrice()
        const topGamesData = await parseTopGames();
    
        const platformsSet = new Set()
        const developersSet = new Set()
        const publishersSet = new Set()
        const contentTypeSet = new Set()
        const processedGameIds = new Set();
        const processedTopGamesIds = new Set();

        gamesData.forEach(infoGame =>{
            platformsSet.add(infoGame.gamePlatform)
            developersSet.add(infoGame.developer)
            publishersSet.add(infoGame.publisher)
            contentTypeSet.add(infoGame.content_type)
        })

        for (const platformName of platformsSet) {
            const platform = await Platform.findOne({ where: { name: platformName } });
            if (!platform) {
                await Platform.create({ name: platformName });
            } else {
                await Platform.update({ name: platformName }, { where: { id: platform.id } });
            }
        }

        for (const contentTypeName of contentTypeSet) {
            const contentType = await ContentType.findOne({ where: { name: contentTypeName } });
            if (!contentType) {
                await ContentType.create({ name: contentTypeName });
            } else {
                await ContentType.update({ name: contentTypeName }, { where: { id: contentType.id } });
            }
        }

        for (const developerName of developersSet) {
            const developer = await Developer.findOne({ where: { name: developerName } });
            if (!developer) {
                await Developer.create({ name: developerName });
            } else {
                await Developer.update({ name: developerName }, { where: { id: developer.id } });
            }
        }

        for (const publisherName of publishersSet) {
            const publisher = await Publisher.findOne({ where: { name: publisherName } });
            if (!publisher) {
                await Publisher.create({ name: publisherName });
            } else {
                await Publisher.update({ name: publisherName }, { where: { id: publisher.id } });
            }
        }

        //заполнение таблиц steam_games,platform,developer, publisher, content_type       
        for(const info of gamesData)
        {
            const platform = await Platform.findOne({ where: { name: info.gamePlatform } });
            const developer = await Developer.findOne({ where: { name: info.developer } });
            const publisher = await Publisher.findOne({ where: { name: info.publisher} });
            const content_type = await ContentType.findOne({ where: { name: info.content_type } });

            const checkSteam = await SteamGame. findOne({
                where: { title: info.title } 
            });
            if(!checkSteam)
            {
                await SteamGame. create({
                    //id: info.id,
                    title: info.title,
                    content_type_id: content_type.id,
                    imageUrl: info.imageUrl,
                    description: info.description,
                    release_date: info.releaseData,
                    platform_id: platform.id,
                    genres: info.genres,
                    developer_id: developer.id,
                    publisher_id: publisher.id,
                    min_system_requirements: info.minSystem,
                    recommended_system_requirements: info.recSystem,
                    supported_languages: info.supportedLanguage,
                    supported_OS: info.supportedOS,
                    url: info.urlGame,
                    status: info.statusProduct
                })
            }
        }

        //заполнение таблицы SteamPrice
        for (const priceInfo of pricesData) {
            if (priceInfo.gameId && !processedGameIds.has(priceInfo.gameId)) { // Проверяем, что gameId определен и не обработан
                const game = await SteamGame. findOne({ where: { id: priceInfo.gameId } });
                if (game) {
                    const existingPrice = await SteamPrice.findOne({ where: { gameId: game.id } });
                    if (!existingPrice) {
                        const priceFloat = parseFloat(priceInfo.priceGame);
                        //не считывает 0, так как для js 0 - это ложное значение
                        if (!Number.isNaN(priceFloat)) { 
                            await SteamPrice.create({
                                gameId: game.id,
                                price: priceFloat
                            });
                            // Добавляем gameId в множество обработанных
                            processedGameIds.add(priceInfo.gameId);
                        } else {
                            console.log(`Не удалось преобразовать цену ${priceInfo.priceGame} в float для gameId: ${priceInfo.gameId}`);
                        }
                    }
                }
            }
        }

        //заполнение таблицы steam_top_sellers
        for (const topGame of topGamesData) {
            // Проверяем, что gameId определен и не обработан
            if (topGame.title && !processedTopGamesIds.has(topGame.title)) {
                const game = await SteamGame. findOne({ where: { title: topGame.title } });
                if (game) {
                    // Проверяем, существует ли уже запись с таким gameId в таблице SteamTopGame 
                    const existingTopSeller = await SteamTopGame .findOne({ where: { gameId: game.id } });

                    // Если запись не существует, создаем новую
                    if (!existingTopSeller) {
                        await SteamTopGame .create({
                            gameId: game.id, // Используем id из таблицы SteamGame
                             position: topGame.position, // Позиция из топ-списка
                        });

                        // Добавляем title в множество обработанных, чтобы избежать дублирования
                        processedTopGamesIds.add(topGame.title);
                    }
                } else {
                    console.log(`Игра "${topGame.title}" не найдена в таблице SteamGame. `);
                }
            }
        }

        console.log('---данные успешно сохранены и записаны---')        
    } catch (error) {
        console.log('подключения нет\n', error);
    }
}

connectSteamGames()