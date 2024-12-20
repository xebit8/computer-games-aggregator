const express = require('express');
const path = require('path');
const { Op } = require("sequelize");
const { EpicGame, SteamGame, EpicNews, SteamNews, EpicTopGame, SteamTopGame, Developer, ContentType, Publisher } = require("../general/models");

const app = express();
const port = 3030;

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/steam/games', async (req, res) => {
  const games = await SteamGame.findAll();
  res.render('steam/steam_games_page', { games });
});

app.get('/steam/games/:id', async (req, res) => {
  const game = await SteamGame.findByPk(req.params.id);
  const content_type = await ContentType.findByPk(game.content_type_id);
  const publisher = await Publisher.findByPk(game.publisher_id);
  const developer = await Developer.findByPk(game.developer_id);
  res.render('steam/steam_game_page', { game, content_type, publisher, developer });
});

app.get('/steam/top-games', async (req, res) => {
  const topGames = await SteamTopGame.findAll();
  const gameIds = topGames.map(game => game.gameId);
  const topGamesTitles = await SteamGame.findAll({
    attributes: ['title'],
    where: {
      id: { [Op.in]: gameIds }
    }
  });
  res.render('steam/steam_top_games_page', {topGames, topGamesTitles });
});

app.get('/steam/news', async (req, res) => {
  const news = await SteamNews.findAll();
  res.render('steam/steam_news_page', { news });
});

app.get('/epicgames/games', async (req, res) => {
  const games = await EpicGame.findAll();
  res.render('epicgames/epic_games_page', { games });
});

app.get('/epicgames/games/:id', async (req, res) => {
  const game = await EpicGame.findByPk(req.params.id);
  const content_type = await ContentType.findByPk(game.content_type_id);
  const publisher = await Publisher.findByPk(game.publisher_id);
  const developer = await Developer.findByPk(game.developer_id);
  res.render('epicgames/epic_game_page', { game, content_type, publisher, developer });
});

app.get('/epicgames/top-games', async (req, res) => {
  const topGames = await EpicTopGame.findAll();
  const game_ids = topGames.map(game => game.game_id);
  const topGamesTitles = await EpicGame.findAll({
    attributes: ['title'],
    where: {
      id: { [Op.in]: game_ids }
    }
  });
  res.render('epicgames/epic_top_games_page', { topGames, topGamesTitles });
});

app.get('/epicgames/news', async (req, res) => {
  const news = await EpicNews.findAll();
  res.render('epicgames/epic_news_page', { news });
});


// const createPagePerSteamGame = (route, pageSlug) => {
//   app.get(`/${route}/${pageSlug}`, async (res) => {
//     try {
//       const data = await 
//       const grouped = groupData(data, "employer");
//       const graphData = Object.entries(grouped).map(([key, values]) => ({
//         name: key,
//         data: values.map((v) => v.title),
//       }));
//       res.json(graphData);
//     } catch (err) {
//       res.status(500).send(err.message);
//     }
//   });
// };

// const createPagePerEpicGame = (route, pageSlug) => {
//   app.get(`/${route}/${pageSlug}`, async (res) => {
//     try {
//       const data = await EpicGame.findAll();
//       const grouped = groupData(data, "employer");
//       const graphData = Object.entries(grouped).map(([key, values]) => ({
//         name: key,
//         data: values.map((v) => v.title),
//       }));
//       res.json(graphData);
//     } catch (err) {
//       res.status(500).send(err.message);
//     }
//   });
// };

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});