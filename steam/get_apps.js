const axios = require("axios");
const cheerio = require("cheerio");
const getAppsList = require("./get_apps_list.js");
const { session_cookie } = require("../2auth.js");


(async function getApps() {
    try 
    {
        const appsList = await getAppsList();
        //console.log(appsList);
        console.log("--------------------------------------------------------");
        for (let app of appsList)
        {
            console.log(app);
            await getAppData(app);
            console.log("--------------------------------------------------------");
        }
    } catch (error) {
        console.error("Couldn't get games info.", error);
    }
})();

async function getAppData(app) {
    try {
        const delay = seconds => new Promise(resolve => setTimeout(resolve, seconds * 1000));
        await delay(2);
        const baseUrl = "https://store.steampowered.com/app/";
        console.log("Ссылка на игру:", baseUrl + app.appid);
        const response = await axios.get(baseUrl + app.appid, {
            headers: {
                Cookie: "wants_mature_content=1",
            }
        });
        const $ = cheerio.load(response.data);
        const $error = $(".error").text();
        console.log("Ошибка (если есть):", $error || "Нет");
        const $releaseDate = $(".date").text();
        console.log("Дата релиза:", $releaseDate || "Не найдено");
        // const $gamePurchaseArea = $(".game_area_purchase_game ");
        // if ($totalPrice === "") {
        //     $totalPrice = "Yet to be announced..."
        // }
        // else if ($totalPrice === "")
        // console.log("found: " + $totalPrice.text().trim());
        
    } catch (error) {
        console.error("Couldn't get info from Steam's game page", error);
    }
}
