const {sequelize} = require('../general/sequelize.js')
const {infoForTableNews} = require('./parserSteam.js')
const {SteamNews} = require('../general/models.js')

async function connectNewsTable() {
    const newsData = await infoForTableNews();
    for(const infoNews of newsData)
    {
        const checkNews = await SteamNews.findOne({
            where: { url: infoNews.urlNews } 
        });
        if(!checkNews)
        {
            await SteamNews.create({
                title: infoNews.title,
                text: infoNews.textNews,
                url: infoNews.urlNews,
            })
        }
        
    }
}
connectNewsTable()