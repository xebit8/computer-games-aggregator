const sequelize = require('../general/sequelize')
const {infoForTableGame,infoForTablePrice} = require('./parserSteam.js')
const {parseTopGames} = require('./chartGameSteam.js')
const { SteamGame, Developer, Publisher, SteamPrice, SteamTopGame } = require('../general/models')

async function connectSteamGames() {
    try {
        await sequelize.authenticate()
        console.log('---подключение есть---')

        //await sequelize.sync({ force: true })

        const gamesData = await infoForTableGame();
        const pricesData = await infoForTablePrice()
        const topGamesData = await parseTopGames();
    
        const developersSet = new Set()
        const publishersSet = new Set()
        const processedGameIds = new Set();
        const processedTopGamesIds = new Set();

        gamesData.forEach(infoGame =>{
            developersSet.add(infoGame.developer)
            publishersSet.add(infoGame.publisher)
        })

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
            const developer = await Developer.findOne({ where: { name: info.developer } });
            const publisher = await Publisher.findOne({ where: { name: info.publisher} });

            const checkSteam = await SteamGame. findOne({
                where: { title: info.title } 
            });
            if(!checkSteam)
            {
                await SteamGame. create({
                    title: info.title,
                    content_type: info.content_type,
                    description: info.description,
                    release_date: info.releaseData,
                    genres: info.genres,
                    developer_id: developer.id,
                    publisher_id: publisher.id,
                    min_system_requirements: info.minSystem,
                    recommended_system_requirements: info.recSystem,
                    supported_languages: info.supportedLanguage,
                    supported_os: info.supportedOS,
                    url: info.urlGame,
                    status: info.statusProduct,
                    imageUrl: info.imageUrl,
                })
            }
        }

        //заполнение таблицы SteamPrice
        for (const priceInfo of pricesData) {
            if (priceInfo.game_id && !processedGameIds.has(priceInfo.game_id)) { // Проверяем, что game_id определен и не обработан
                const game = await SteamGame. findOne({ where: { id: priceInfo.game_id } });
                if (game) {
                    const existingPrice = await SteamPrice.findOne({ where: { game_id: game.id } });
                    if (!existingPrice) {
                        const priceFloat = parseFloat(priceInfo.priceGame);
                        //не считывает 0, так как для js 0 - это ложное значение
                        if (!Number.isNaN(priceFloat)) { 
                            await SteamPrice.create({
                                game_id: game.id,
                                price: priceFloat
                            });
                            // Добавляем game_id в множество обработанных
                            processedGameIds.add(priceInfo.game_id);
                        } else {
                            console.log(`Не удалось преобразовать цену ${priceInfo.priceGame} в float для game_id: ${priceInfo.game_id}`);
                        }
                    }
                }
            }
        }

        //заполнение таблицы steam_top_sellers
        for (const topGame of topGamesData) {
            // Проверяем, что game_id определен и не обработан
            if (topGame.title && !processedTopGamesIds.has(topGame.title)) {
                const game = await SteamGame. findOne({ where: { title: topGame.title } });
                if (game) {
                    // Проверяем, существует ли уже запись с таким game_id в таблице SteamTopGame 
                    const existingTopSeller = await SteamTopGame .findOne({ where: { game_id: game.id } });

                    // Если запись не существует, создаем новую
                    if (!existingTopSeller) {
                        await SteamTopGame .create({
                            game_id: game.id, // Используем id из таблицы SteamGame
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