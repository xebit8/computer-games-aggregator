const axios = require("axios");


const query = "";

module.exports = async function fetchNews() {
    try {
        const news = [];
        let start = 0;
        let total = 100;
        let count = 100;
        do {
            const response = await axios.get(`https://store-content-ipv4.ak.epicgames.com/api/ru/content/blog-posts?country=RU&locale=ru&count=${count}&start=${start}`);
            const data = response.data;
            data.elements.forEach(element => {
                const url = "https://store.epicgames.com"+element.url.replace("/blog", "/news");
                news.push({
                    "title": element.title,
                    "short_description": element.short,
                    "url": url,
                });
            });
            total = data.paging.total;
            start += data.paging.count;
        } while (start < total)
            // console.log(news);
            return news;
    } catch (error) {
        console.error("Error!", error);
    }
};