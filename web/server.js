const express = require('express');
const path = require('path');
const { Op } = require("sequelize");
const { EpicGame, SteamGame, EpicNews, SteamNews, EpicTopGame, SteamTopGame, Developer,  Publisher, Favourite } = require("../general/models");


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

app.get('/steam/game/:id', async (req, res) => {
  const game = await SteamGame.findByPk(req.params.id);
  const publisher = await Publisher.findByPk(game.publisher_id);
  const developer = await Developer.findByPk(game.developer_id);
  res.render('steam/steam_game_page', { game, publisher, developer });
});

app.get('/steam/top-games', async (req, res) => {
  const topGames = await SteamTopGame.findAll();
  const gameIds = topGames.map(game => game.game_id);
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

app.post('/steam/games/create', async (req, res) => {
  const developer = await Developer.create(req.body.developer);
  const publisher = await Publisher.create(req.body.publisher);

  await SteamGame.create({
    "title": req.body.title,
    "content_type": req.body.content_type,
    "description": req.body.description,
    "release_date": req.body.release_date,
    "genres": req.body.genres,
    "developer_id": developer.id,
    "publisher_id": publisher.id,
    "min_system_requirements": req.body.min_system_requirements,
    "recommended_system_requirements": req.body.recommended_system_requirements,
    "supported_languages": req.body.supported_languages,
    "supported_os": req.body.supported_os,
  });
  res.status(200).json({ message: 'Игра успешно создана!' });
});

app.get('/steam/game/:id/update', async (req, res) => {
  const game = await SteamGame.findByPk(req.params.id);
  const publisher = await Publisher.findByPk(game.publisher_id);
  const developer = await Developer.findByPk(game.developer_id);
  res.render('steam/steam_game_update_page', { game, publisher, developer });
});

app.post('/steam/games/update', async (req, res) => {
  const content_type = await ContentType.create(req.body.content_type);
  const developer = await Developer.create(req.body.developer);
  const publisher = await Publisher.create(req.body.publisher);

  await SteamGame.update({
    "title": req.body.title,
    "content_type": req.body.content_type,
    "description": req.body.description,
    "release_date": req.body.release_date,
    "genres": req.body.genres,
    "developer_id": developer.id,
    "publisher_id": publisher.id,
    "supported_os": req.body.supported_os,
    "min_system_requirements": req.body.min_system_requirements,
    "recommended_system_requirements": req.body.recommended_system_requirements,
    "supported_languages": req.body.supported_languages,
  }, {where: { id: req.body.id }});
  res.status(200).json({ message: 'Игра успешно обновлена!' });
});

app.delete("/steam/games/delete", async (req, res) => {
  await SteamGame.destroy({ where: {id: req.body.id }});
  res.status(200).json({ message: 'Игра успешно удалена!' });
})

// app.get('/steam/games/sort-by-title', async (req, res) => {
//   try {
//     const games = await SteamGame.findAll({
//       order: [['title', 'ASC']]
//     });

//     res.json({ games });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Ошибка сервера' });
//   }
// });

// app.get('/steam/filter-by-supported-os', async (req, res) => {
//   try {
//     // Получаем игры, где supported_us равно true
//     const games = await SteamGame.findAll({
//       where: { supported_os: "Windows" } // Фильтрация по полю supported_us
//     });

//     // Возвращаем отфильтрованные игры
//     res.json({ games });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Ошибка сервера' });
//   }
// });

app.get('/epicgames/games', async (req, res) => {
  const games = await EpicGame.findAll();
  res.render('epicgames/epic_games_page', { games });
});

app.get('/epicgames/game/:id', async (req, res) => {
  const game = await EpicGame.findByPk(req.params.id);
  const publisher = await Publisher.findByPk(game.publisher_id);
  const developer = await Developer.findByPk(game.developer_id);
  res.render('epicgames/epic_game_page', { game, publisher, developer });
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

app.post('/epicgames/games/create', async (req, res) => {
  const developer = await Developer.create(req.body.developer);
  const publisher = await Publisher.create(req.body.publisher);

  await EpicGame.create({
    "title": req.body.title,
    "content_type": req.body.content_type,
    "description": req.body.description,
    "release_date": req.body.release_date,
    "genres": req.body.genres,
    "developer_id": developer.id,
    "publisher_id": publisher.id,
    "supported_os": req.body.supported_os,
  });
  res.status(200).json({ message: 'Игра успешно создана!' });
});

app.get('/epicgames/game/:id/update', async (req, res) => {
  const game = await EpicGame.findByPk(req.params.id);
  const publisher = await Publisher.findByPk(game.publisher_id);
  const developer = await Developer.findByPk(game.developer_id);
  res.render('epicgames/epic_game_update_page', { game, publisher, developer });
});

app.post('/epicgames/games/update', async (req, res) => {
  const developer = await Developer.create(req.body.developer);
  const publisher = await Publisher.create(req.body.publisher);

  await EpicGame.update({
    "title": req.body.title,
    "content_type": req.body.content_type,
    "description": req.body.description,
    "release_date": req.body.release_date,
    "genres": req.body.genres,
    "developer_id": developer.id,
    "publisher_id": publisher.id,
    "supported_os": req.body.supported_os,
  }, {where: { id: req.body.id }});
  res.status(200).json({ message: 'Игра успешно обновлена!' });
});

app.delete("/epicgames/games/delete", async (req, res) => {
  await EpicGame.destroy({ where: {id: req.body.id }});
  res.status(200).json({ message: 'Игра успешно удалена!' });
})

// app.get('/epicgames/games/sort-by-title', async (req, res) => {
//   try {
//     const games = await EpicGame.findAll({
//       order: [['title', 'ASC']]
//     });

//     res.json({ games });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Ошибка сервера' });
//   }
// });

// app.get('/epicgames/filter-by-supported-os', async (req, res) => {
//   try {
//     const games = await EpicGame.findAll({
//       where: { supported_os: "Windows" } // Фильтрация по полю supported_us
//     });

//     // Возвращаем отфильтрованные игры
//     res.json({ games });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Ошибка сервера' });
//   }
// });

app.post('/favourites', async (req, res) => {
  const { game_id, platform } = req.body;

  try {
    const existingFavourite = await Favourite.findOne({
      where: { game_id, platform },
    });

    if (existingFavourite) {
      return res.status(400).json({ message: 'Игра уже добавлена в избранное.' });
    }

    await Favourite.create({ game_id, platform });
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

    const favouriteGamesTitlesAndPlatform = [];

    for (const game of favouriteGames) {
      let gameTitle;

      if (game.platform === "Steam") {
        gameTitle = await SteamGame.findOne({
          attributes: ['title'],
          where: { id: game.game_id }
        });
      } else if (game.platform === "Epic Games") {
        gameTitle = await EpicGame.findOne({
          attributes: ['title'],
          where: { id: game.game_id }
        });
      }

      favouriteGamesTitlesAndPlatform.push({
        game_id: game.game_id,
        title: gameTitle ? gameTitle.title : 'Unknown',
        platform: game.platform
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