const express = require('express');
const path = require('path');
const { Op } = require("sequelize");
const { EpicGame, SteamGame, EpicNews, SteamNews, EpicTopGame, SteamTopGame, Developer, ContentType, Publisher, Favourite, Platform } = require("../general/models");

const app = express();
const port = 3030;

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.post('/favourites', async (req, res) => {
  const { game_id, platform_id } = req.body;

  try {
    const existingFavourite = await Favourite.findOne({
      where: { game_id, platform_id },
    });

    if (existingFavourite) {
      return res.status(400).json({ message: 'Игра уже добавлена в избранное.' });
    }

    await Favourite.create({ game_id, platform_id });
    res.status(201).json({ message: 'Игра успешно добавлена в избранное.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
});

app.get('/favourites/check', async (req, res) => {
  const { game_id, platform_id } = req.query;

  try {
    const existingFavourite = await Favourite.findOne({
      where: { game_id, platform_id },
    });

    if (existingFavourite) {
      return res.json({ isFavourite: true });
    } else {
      return res.json({ isFavourite: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
});

app.get('/favourites/show', async (req, res) => {
  try {
    const favouriteGames = await Favourite.findAll();

    const game_ids = favouriteGames.map(game => game.game_id);

    const platforms = await Platform.findAll({
      where: { id: { [Op.in]: favouriteGames.map(game => game.platform_id) } }
    });

    const favouriteGamesTitlesAndPlatform = [];

    for (const game of favouriteGames) {
      let gameTitle;

      if (game.platform_id === 1) {
        gameTitle = await SteamGame.findOne({
          attributes: ['title'],
          where: { id: game.game_id }
        });
      } else if (game.platform_id === 2) {
        gameTitle = await EpicGame.findOne({
          attributes: ['title'],
          where: { id: game.game_id }
        });
      }

      favouriteGamesTitlesAndPlatform.push({
        game_id: game.game_id,
        title: gameTitle ? gameTitle.title : 'Unknown',
        platform_id: game.platform_id
      });
    }

    res.render("favourites", { favouriteGames: favouriteGamesTitlesAndPlatform });
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка сервера');
  }
});

app.delete('/favourites', async (req, res) => {
  const { game_id, platform_id } = req.body;

  try {
    const deletedRows = await Favourite.destroy({
      where: { game_id, platform_id },
    });

    if (deletedRows > 0) {
      return res.json({ message: 'Игра успешно удалена из избранного.' });
    } else {
      return res.status(404).json({ message: 'Игра не найдена в избранном.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});