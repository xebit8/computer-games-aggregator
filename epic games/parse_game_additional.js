const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());
let response = "";

module.exports = async function getAdditionalGameData(productId, offerId) {
  try {

    const url = `https://egs-platform-service.store.epicgames.com/api/v1/egs/products/${productId}/offers/${offerId}?country=RU&locale=ru&store=EGS`;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    response = await page.evaluate(() => { return document.body.innerText; });
    const data = JSON.parse(response);
    await browser.close();

    let status = "";
    const statusList = ["AvailableToPurchase", "AvailableToClaim"];
    const errorMsg = "Attempted to get data from unavailable offer";
    if (data.errorMessage === errorMsg) {
      return {
        "title": "-",
        "status": "Unavailable",
        "content_type": "-",
        "genres": "-",
        "supported_os": "-",
        "developer": "-",
        "release_date": "-",
      };
    }
    else if (statusList.includes(data.purchase[0].status)) status = "Available";
    else if (data.purchase[0].status === "Unavailable") status = "Announced"

    let content_type = "";
    if (data.categories.includes("games/edition/base")) content_type = "Base game";
    else if (data.categories.includes("addons")) content_type = "DLC";
    else if (data.categories.includes("games/demo")) content_type = "Demo";

    let genresList = [];
    for (let genre of data.tags.genres) {
      genresList.push(genre.name);
    }
    let genres = genresList.join(", ");

    let supported_os_list = [];
    for (let os of data.tags.platforms) {
      supported_os_list.push(os.name);
    }
    let supported_os = supported_os_list.join(", ");

    const title = data.title;
    let developer = data.developers[0];
    let release_date = "Скоро";
    if (data.releaseDate != undefined) {
      if (data.releaseDate.type === "ExactDate") 
      {
        let date = new Date(data.releaseDate.timestamp);
        if (date.getFullYear() !== 2099) release_date = date.toLocaleDateString(); 
      }
      else if (data.releaseDate.type === "ApproximateByYear") release_date = data.releaseDate.year;
      else if (data.releaseDate.type === "ApproximateByMonth") {
        const year = data.releaseDate.year;
        const month = data.releaseDate.month;
        if (month < 10) month = `0${month}`;
        release_date = `${month}.${year}`;
      }
    }

    return {
      "title": title,
      "status": status,
      "content_type": content_type,
      "genres": genres,
      "supported_os": supported_os,
      "developer": developer,
      "release_date": release_date,
    };
  } catch (error) {
    console.error("Game not found!", response);
    return {
      "title": null,
      "status": null,
      "content_type": null,
      "genres": null,
      "supported_os": null,
      "developer": null,
      "release_date": null,
    };
  }
};

