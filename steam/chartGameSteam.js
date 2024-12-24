const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function parseTopGames() {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();

    // Переход на страницу(открывает ее)
    await page.goto('https://store.steampowered.com/charts/topselling/RU');

    // Ждем, пока страница полностью загрузится
    await page.waitForSelector('tbody tr');

    const html = await page.content();
    const $ = cheerio.load(html);

    const games = []; // Массив для хранения всех игр

    // Парсим данные
    $('tbody tr').each((i, element) => {
        const $element = $(element);
        const positionGame = $element.find('td:nth-child(2)').text().trim();
        const nameGame = $element.find('td:nth-child(3)').text().trim();

        const product = {
            game_id: i + 1, 
            position: positionGame,
            title: nameGame,
        };

        games.push(product); 
    });

    //console.log(games)

    await browser.close();

    return games;
}



parseTopGames()
// Экспортируем функцию для использования в других файлах
module.exports = { parseTopGames };