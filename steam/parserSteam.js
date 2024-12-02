const Steam = require('steam-api-web');
const cheerio = require('cheerio');
const steam = new Steam('06E1DB95CAB70F21DAEE9895548F969F'); //optional key
const axios = require('axios')

//https://store.steampowered.com/app/3244360/Plant_the_Towers/
//https://store.steampowered.com/app/{appId}/{Name}/ -нужно создавать такую ссылку

const filterAppList = [];
const infOfGame = [];
const dopContent = [];
const noAccessGame = []

const priceGames = []

async function getSteamAppList() {
    try {
        const response = await axios.get('https://api.steampowered.com/ISteamApps/GetAppList/v2/');
        //const response = await axios.get('');
        const appIdList = response.data.applist.apps;
    
        //appIdList.sort((a, b) => a.name.localeCompare(b.name)); //сортировка по имени игры

        let countsId = 0;
        // // Выводим список игр и их appId
        for (let i = 0; i < appIdList.length; i++) {
            const app = appIdList[i];
            //console.log(`AppID: ${app.appid}, Name: ${app.name}`);
            if (app.name.length!=0 && !app.name.toLowerCase().includes('test')) 
                {    
                //console.log(`номер ${countsId + 1} --- AppID: ${app.appid}, Name: ${app.name}`);
                filterAppList.push(app);
                countsId++;
                if (countsId ===20) {
                    break;
                }
            }
        }
        
        for(let i=0;i<filterAppList.length;i++)
            //console.log(`${i}`,filterAppList[i]) 

        //console.log(countsId)
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

//парсер для инфы по играм(для таблички ИГРЫ)
async function parseProductPage(url, elementName, elementId) {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        let elDescription = ''; //сбрасываем переменную, потмоу что иногда бывает так, что некоторым играм приписывается чужое описание
        let elReleaseData = ''; 
        let elDeveloper = '';
        let elPublisher = '';
        let elGenres = '';
        let elMinSystem = '';
        let elRecSystem = '';
        let elSupportedOS = ''
        if ($('.game_page_background.game').length>0) //класс который есть именно у игр
        {
            //здесь селекторы для извлечение инфы именно по играм. Длс, саундтреки будут автоматически уходить в другие массивы

            //класс в котором описание,дата выхода, издатель, разработчик
            $(".glance_ctn").each((i, element) => { 
                const $element = $(element);
                elDescription = $element.find('.game_description_snippet').text().trim();
                elReleaseData = $element.find('.date').text().trim()
                elDeveloper = $element.find('.dev_row').eq(0).text().replace(/\s+/g,"")
                elPublisher = $element.find('.dev_row').eq(1).text().replace(/\s+/g,"")
            });
            //класс с жанром игры(чисто для удобства и красоты, сюда можно перенести дату выхода, издателя и разработчика), так будет немного логичнее, но в целом без разницы
            $('.block_content_inner').each((i,element) =>{
                const $element = $(element)
                elGenres = $element.find('#genresAndManufacturer span').eq(0).text().trim()
            })
            //класс с системными требованиями + поддерживаемые OS
            $('.game_page_autocollapse.sys_req').each((i,element) => {
                const $element = $(element)
                if ($('.game_area_sys_req_leftCol').length>0)
                {
                    elMinSystem = $element.find('.game_area_sys_req_leftCol').eq(0).text().trim() //eq(0) -это параметры для винды, если поставить 1 - это для мака и тд
                    elRecSystem = $element.find('.game_area_sys_req_rightCol').eq(0).text().trim()
                }
                else{ elMinSystem = $element.find('.game_area_sys_req_full').eq(0).text().trim() }

                elSupportedOS = $element.find('.sysreq_tab').text().trim().replace('+','').replace(/\s+/g,",")
                //console.log(elSupportedOS)
            
            })            
        }
        else //случай когда нет доступа к игре
        {
            $(".page_content .pageheader").each((i, element) => {
                const $element = $(element);
                elError = $element.text() //.replace(/\s+/g,"")
                //console.log(elError)
            });
        }

        const product = { 
            appId: elementId,
            title: elementName,
            urlGame: url,
            description: elDescription,
            releaseData: elReleaseData,
            developer: elDeveloper,
            publisher: elPublisher,
            genres:elGenres,
            minSystem : elMinSystem,
            recSystem: elRecSystem,
            supportedOS: elSupportedOS || 'Windows' ,
        }; 

       // Проверяем наличие класса .page_content .pageheader
       if ($('.page_content .pageheader').length > 0) {
        product.description = 'без доступа к игре';
        product.supportedOS = '';
        noAccessGame.push(product);
       }
       else {
            // Проверяем наличие класса .glance_details (класс который есть у доп контента)
            if ($('.glance_details').length > 0) {
                product.description = 'dopContent'
                dopContent.push(product);
            } 
            else {
                infOfGame.push(product);
            }
        }
    } catch (error) {
        console.error('Error parsing product page:', error.message);
    }
}

//парсер для цен игр
async function parsePriceProduct(url) {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        let elPrice = '' 

        if ($('.game_purchase_action_bg').length>0){ //класс который есть именно у игр, длс, саундтреков
            //если ценник игры без скидки или игра бесплатная
            if ($('.game_purchase_action_bg .game_purchase_price.price').length>0){

                $(".game_purchase_price.price").each((i, element) => { 
                    const $element = $(element);

                    elPrice = $element.text().trim()
                })
            }
            //игра со скидкой
            else{
                $(".game_purchase_action_bg .discount_final_price").each((i, element) => { 
                    const $element = $(element);

                    elPrice = $element.text().trim()
                })
            }
        }


        const product = { 
            urlGame: url,
            priceGame: elPrice 
        }; 

        if($('.game_purchase_action_bg .discount_final_price').length>0)
        {
            product.priceGame = `игра со скидкой - ${elPrice}` 
        }

        if(product.priceGame.length == 0)
            product.priceGame = "не доступна в нашем регионе"


        priceGames.push(product)
    } catch (error) {
        console.error('Error parsing product page:', error.message);
    }
}



//функции которые будем импортировать в бд
//идея: можно переименовать вместо Main, сделать это чисто для таблички игр. А для данных других табличик сделать другие функции которые будем импортировать для бд
async function infoForTableGame() {
    const filterAppList = await getSteamAppList();
    const pages = await getPagesProduct(filterAppList);

    for (let i = 0; i < pages.length; i++) {
        const url = pages[i];
        const elementName = filterAppList[i].name;
        const elementId = filterAppList[i].appid;
        await parseProductPage(url, elementName, elementId);
    }

    console.log('Игры:');
    for (let j = 0; j < infOfGame.length; j++) {
        console.log(j+1);
        console.log(infOfGame[j]);
    }

    console.log('Доп. контент:');
    for (let j = 0; j < dopContent.length; j++) {
        console.log(j+1);
        console.log(dopContent[j]);
    }

    console.log('без доступа к игре:');
    for (let j = 0; j < noAccessGame.length; j++) {
        console.log(j+1);
        console.log(noAccessGame[j]);
    }
}

//пример
async function infoForTablePrice() {
    //ссылка на игру + ее цена
    const filterAppList = await getSteamAppList();
    const pages = await getPagesProduct(filterAppList);
    for (let i = 0; i < pages.length; i++) {
        const url = pages[i];
        await parsePriceProduct(url);
    }

    for(let j=0;j<priceGames.length;j++)
    {
        console.log(j+1);
        console.log(priceGames[j]);
    }
    
}

infoForTablePrice()
//infoForTableGame();



// Пример использования
//const appIds = [440, 570]; // Идентификаторы игр Team Fortress 2 и Dota 2
// getDLCForApps(appIds);
// steam.getNewsForApp(440, 5, 200) //appId, кол-во новостей, макс.длина символов новости
//     .then(result => {
//         result.news.forEach(item => {
//             //console.log(item)
//             console.log(`Title: ${item.title}`)
//             console.log(`url: ${item.url}`)
//             console.log(`id: ${item.id}`)
//         });
//     })
//     .catch(err => console.error(err.message));

 