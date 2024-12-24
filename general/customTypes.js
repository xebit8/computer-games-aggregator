const sequelize = require("./sequelize");

sequelize.query("CREATE TYPE content_type AS ENUM ('Игра', 'Доп. контент', 'Демо-версия игры')");
sequelize.query("CREATE TYPE status AS ENUM ('Доступна', 'Недоступна', 'Анонсирована', 'Ранний доступ')");
sequelize.query("CREATE TYPE event_type AS ENUM ('INSERT', 'UPDATE', 'DELETE')");