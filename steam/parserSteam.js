const cheerio = require('cheerio');
const axios = require('axios');
const Steam = require('steam-api-web');
const { optional_key } = require('../general/2auth');
const steam = new Steam(optional_key); // optional key

// https://store.steampowered.com/app/3244360/Plant_the_Towers/
// https://store.steampowered.com/app/{appId}/{Name}/ - нужно создавать такую ссылку

const filterAppList = []; //массив с appId и name с файла стим
const infOfGame = []; // Массив игр
const dopContent = []; // Массив DLC
const noAccessGame = []; // Массив игр без доступа
const newsGames =[] //массив для новостей
const priceGames = [] //массив для цен игр

async function getSteamAppList() {
    try {
        const response = await axios.get('https://api.steampowered.com/ISteamApps/GetAppList/v2/');
        //const response = await axios.get('');
        const appIdList = response.data.applist.apps.slice(-20); // Выборка из 20 экземпляров для тестов
        //const appIdList = response.data.applist.apps;
    
        //appIdList.sort((a, b) => a.name.localeCompare(b.name)); // Сортировка по имени игры
        // Выводим список игр и их appId
        for (let i = 0; i < appIdList.length; i++) {
            const app = appIdList[i];
            //console.log(`AppID: ${app.appid}, Name: ${app.name}`);
            if (app.name.length != 0 && !app.name.toLowerCase().includes('test')) // Убираем пустые и тестовые приложения
                {    
                //console.log(`номер ${countsId + 1} --- AppID: ${app.appid}, Name: ${app.name}`);
                filterAppList.push(app);
            }
        }
        
        // for(let i = 0; i < filterAppList.length; i++)
        //     console.log(`${i}`,filterAppList[i]) 
        // console.log(countsId)
        return filterAppList;
       
    } catch (error) {
        console.error('Error Steam app list:', error.message);
    }
}

async function getPagesProduct(filterAppList) {
    const pages = [];
    for (let i = 0; i < filterAppList.length; i++) {
        const { appid, name } = filterAppList[i];
        pages.push(`https://store.steampowered.com/app/${appid}/${encodeURIComponent(name)}/`);
    }
    return pages;
}

let counter = 0;
// Парсер для инфы по играм (для таблички ИГРЫ)
async function parseProductPage(url, elementName, elementId) {
    try {
        // Далаем паузу в 2 секунды перед каждым запросом к странице, чтобы избежать блокировку за DoS
        const delay = seconds => new Promise(resolve => setTimeout(resolve, seconds * 1000));
        await delay(2);

        const response = await axios.get(url, { headers: { Cookie: "wants_mature_content=1" }});
        const html = response.data;
        const $ = cheerio.load(html);

        let elImageUrl = ''
        let elDescription = ''; // Сбрасываем переменную, потому что иногда бывает так, что некоторым играм приписывается чужое описание
        let elReleaseData = ''; 
        let elDeveloper = '';
        let elPublisher = '';
        let elGenres = '';
        let elMinSystem = '';
        let elRecSystem = '';
        let elSupportedOS = '';
        let elSupportedLanguage = '';
        let elSupLangMas =[]
        let elProductType = ''; // тип продукта(игра,длс,саундтрек)
        let elStatusProduct = ''


        if ($('.game_page_background.game').length > 0)
        {
            elProductType = 'Game';
            // Здесь селекторы для извлечение инфы именно по играм. Длс, саундтреки будут автоматически уходить в другие массивы

            // Класс в котором ссылка на картинку игры, описание,дата выхода, издатель, разработчик
            $(".glance_ctn").each((i, element) => { 
                const $element = $(element);
                elImageUrl = $element.find('.game_header_image_full').attr('src')
                elDescription = $element.find('.game_description_snippet').text().trim();
                elReleaseData = $element.find('.date').text().trim()
                elDeveloper = $element.find('.dev_row .summary.column').eq(0).text().trim()
                elPublisher = $element.find('.dev_row .summary.column').eq(1).text().trim()
            });
            // Класс с жанром игры (чисто для удобства и красоты, сюда можно перенести дату выхода, издателя и разработчика), так будет немного логичнее, но в целом без разницы
            $('.block_content_inner').each((i,element) => {
                const $element = $(element);
                elGenres = $element.find('#genresAndManufacturer span').eq(0).text().trim();
            })
            // Класс с системными требованиями + поддерживаемые OS (пока только Windows)
            $('.game_page_autocollapse.sys_req').each((i,element) => {
                const $element = $(element);
                if ($('.game_area_sys_req_leftCol').length > 0)
                {
                    elMinSystem = $element.find('.game_area_sys_req_leftCol').eq(0).text().trim(); // eq(0) -это параметры для винды, если поставить 1 - это для мака и тд
                    elRecSystem = $element.find('.game_area_sys_req_rightCol').eq(0).text().trim();
                }
                else elMinSystem = $element.find('.game_area_sys_req_full').eq(0).text().trim();

                elSupportedOS = $element.find('.sysreq_tab').text().trim().replace('+','').replace(/\s+/g,",");
                //console.log(elSupportedOS);
            })            

            //класс с поддерживаемыми языками
            $('.game_language_options tbody tr').each((i,element)=>{
                const $element = $(element);
                const language = $element.find('td:nth-child(1)').text().trim();
                if (language) {
                    elSupLangMas.push(language);
                }
            });
            // Объединяем массив языков в строку
            elSupportedLanguage = elSupLangMas.join(', ');

            //класс со статусами игры
            if($('.game_area_comingsoon.game_area_bubble').length>0){
                elStatusProduct = 'announced'
            }
            else if($('.early_access_header').length>0)
            {
                elStatusProduct = 'Early Access Game'
            }
            else elStatusProduct = 'Доступна'

        }
        else // Случай, когда нет доступа к игре
        {
            $(".page_content .pageheader").each((i, element) => {
                const $element = $(element);
                elError = $element.text(); // .replace(/\s+/g,"")
                //console.log(elError);
            });
        }

        const product = { 
            id: counter,
            title: elementName,
            urlGame: url,
            imageUrl:elImageUrl,
            description: elDescription,
            releaseData: elReleaseData,
            developer: elDeveloper,
            publisher: elPublisher,
            genres:elGenres,
            minSystem : elMinSystem,
            recSystem: elRecSystem,
            supportedOS: elSupportedOS || 'Windows',
            supportedLanguage: elSupportedLanguage,
            gamePlatform: "steam",
            content_type: elProductType,
            statusProduct: elStatusProduct
        }; 

       // Проверяем наличие класса .page_content .pageheader
       if ($('.page_content .pageheader').length > 0) {
        product.description = 'без доступа к игре';
        product.supportedOS = '';
        product.statusProduct = 'не доступна в РФ'
        noAccessGame.push(product);
       }
       else {
            // Проверяем наличие класса .glance_details (класс который есть у доп. контента)
            if ($('.glance_details').length > 0) {
                product.productType = 'Dop Content'
                product.content_type = "Downloadable content"
                dopContent.push(product);
            } 
            else {
                infOfGame.push(product);
            }
        }

        return product;
    } catch (error) {
        console.error('Error parsing product page:', error.message);
    }
}

// Парсер для цен игр
let countGameId =0;
async function parsePriceProduct(url) {
    try {
        const delay = seconds => new Promise(resolve => setTimeout(resolve, seconds * 1000));
        await delay(2);
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        let elPrice = ''
        let elPriceVariant = ''

        const appIdMatch = url.match(/\/app\/(\d+)\//);
        if (appIdMatch) {
            const appId = appIdMatch[1];
            //console.log(`Found appId: ${appId}`);
            countGameId++; 
        }

        if ($('.game_purchase_action_bg').length > 0) { // Класс который есть именно у игр, длс, саундтреков
            // Если ценник игры без скидки или игра бесплатная
            if ($('.game_purchase_action_bg .game_purchase_price.price').length > 0) {
                const $element = $('.game_purchase_price.price').eq(0); // Берем только первый элемент
                elPriceVariant = $element.text().trim();
                if (elPriceVariant === "Free To Play") {
                    elPrice = elPriceVariant;
                } else {
                    elPrice = elPriceVariant.split(' ')[0].replace(',', '.');
                }
                //countGameId++; 
            } else { // скидка
                const $element = $('.game_purchase_action_bg .discount_final_price').eq(0); // Берем только первый элемент
                elPrice = $element.text().trim().split(' ')[0].replace(',', '.');
                //countGameId++; 
            }
        }

        const product = { 
            //gameId: gameId,
            gameId: countGameId,
            priceGame: elPrice || 'ffff'
        }; 

        if(product.priceGame == 'Free To Play' || product.priceGame =='FOR FREE' || product.priceGame == 'FREE')
            product.priceGame = "0"

        // //игра со скидкой
        // if($('.game_purchase_action_bg .discount_final_price').length>0)
        //     product.priceGame = `игра со скидкой, сейчас такая цена = ${elPrice}` 

        //игра еще не вышла
        //если в выоде написано 1Q - это значит "первый квартал такого то года". Пример со стр Стим: Запланированная дата выхода: 1 квартал 2025 года
        // if($('.game_area_comingsoon.game_area_bubble').length>0)
        //     product.priceGame = ` дата выхода - ${$('.game_area_comingsoon.game_area_bubble h1 span').text()} `

        // //игра не доступна в России
        // if(product.priceGame.length == 0)
        //     product.priceGame = "нет доступна в нашем регионе"

        priceGames.push(product)

        return product
    } catch (error) {
        console.error('Error parsing product page:', error.message);
    }
}

//функция для таблицы "ИГРЫ"
async function infoForTableGame() {
    const filterAppList = await getSteamAppList();
    const pages = await getPagesProduct(filterAppList);

    const gamesData = []
    //запуск парсера для таблицы игр
    for (let i = 0; i < pages.length; i++) {
        const url = pages[i];
        const elementName = filterAppList[i].name;
        const elementId = filterAppList[i].appid;
        const gameInfo = await parseProductPage(url, elementName, elementId);
        gamesData.push(gameInfo)
        counter++;
    }   
    // ---------------вывод---------------
    // console.log('Игры:');
    // for (let j = 0; j < infOfGame.length; j++) {
    //     console.log(j+1);
    //     console.log(infOfGame[j]);
    // }
    // console.log('Доп. контент:');
    // for (let j = 0; j < dopContent.length; j++) {
    //     console.log(j+1);
    //     console.log(dopContent[j]);
    // }
    // console.log('без доступа к игре:');
    // for (let j = 0; j < noAccessGame.length; j++) {
    //     console.log(j+1);
    //     console.log(noAccessGame[j]);
    // }

    return gamesData;
}

//функция для таблицы "ЦЕНЫ"
async function infoForTablePrice() {
    // Ссылка на игру + ее цена
    const filterAppList = await getSteamAppList();
    const pages = await getPagesProduct(filterAppList);

    const priceData =[]
    for (let i = 0; i < pages.length; i++) {
        const url = pages[i];
        const gamePrice =  await parsePriceProduct(url);
        priceData.push(gamePrice)
        

    }
    // ---------------вывод---------------
    // console.log('ценники игр:'); 
    // for(let j=0;j<priceGames.length;j++)
    // {
    //     console.log(j+1);
    //     console.log(priceGames[j]);
    // }
    // console.log(pages)

    return priceData
}

//функция для новостей 
async function infoForTableNews() {
    try {
        const filterAppList = await getSteamAppList()
        for(let i=0;i<filterAppList.length;i++)
        {
            const result = await steam.getNewsForApp(filterAppList[i].appid,10,70) //надо понять сколько будем брать новостей для каждой игры, пока стоит 1
            //console.log(filterAppList[i].appid)
            result.news.forEach(item => {
                newsGames.push({
                    gameName: filterAppList[i].name,
                    title: item.title, ////заголовок новости
                    urlNews: item.url, //ссылка на новость
                    textNews: item.contents  //текст новости
                })
            })

        }
        //console.log(newsGames)
        return newsGames;
    } catch (error) {
        console.log(error.message)
    }
}

//тест новости(попытка вывода всех)
/*
async function getAllNewsForApp(appId, maxCount) {
    let allNews = []; // Массив для хранения всех новостей
    let count = maxCount; // Количество новостей за один запрос
    let startOffset = 0; // Начальный сдвиг для пагинации

    while (true) {
        try {
            // Запрашиваем новости с текущим сдвигом
            const result = await steam.getNewsForApp(appId, count, 12, startOffset);

            // Проверяем, есть ли новости
            if (result.appnews && result.appnews.newsitems && result.appnews.newsitems.length > 0) {
                allNews = allNews.concat(result.appnews.newsitems); // Добавляем новости в массив

                // Если количество новостей меньше запрошенного, значит, это последняя страница
                if (result.appnews.newsitems.length < count) {
                    break;
                }

                // Увеличиваем сдвиг для следующего запроса
                startOffset += count;
            } else {
                // Новости закончились
                break;
            }
        } catch (error) {
            console.error(`Ошибка при получении новостей для игры (AppID: ${appId}):`, error.message);
            break;
        }
    }

    return allNews; // Возвращаем все новости
}
*/

/*
async function infoForTableNews() {
    try {
        const filterAppList = await getSteamAppList(); // Получаем список игр

        for (let i = 0; i < filterAppList.length; i++) {
            const appId = filterAppList[i].appid;
            const gameName = filterAppList[i].name;

            try {
                // Получаем все новости для игры
                const allNews = await getAllNewsForApp(appId,1);

                // Добавляем новости в массив
                allNews.forEach(item => {
                    newsGames.push({
                        gameName: gameName, // Название игры
                        titleNews: item.title, // Заголовок новости
                        urlNews: item.url, // Ссылка на новость
                        textNews: item.contents // Текст новости
                    });
                });
            } catch (error) {
                console.error(`Ошибка при обработке новостей для игры "${gameName}" (AppID: ${appId}):`, error.message);
            }
        }

        console.log(newsGames); // Выводим все новости
        return newsGames
    } catch (error) {
        console.error('Ошибка при выполнении функции infoForTableNews:', error.message);
    }
}
*/

//infoForTableGame();
//infoForTablePrice()
//infoForTableNews()

module.exports={infoForTableGame,infoForTablePrice,infoForTableNews}
 