## Computer games aggregator
Web-application to get information about games from computer games distributors (Steam, Epic Games) using JavaScript and PostgreSQL.
### Project status
The project is currently under development.
### How to start an app
Download the project as ZIP or clone using "git clone https://github.com/xebit8/computer-games-aggregator.git".

Check if you have Node.js installed on your computer.

Use "npm install" to download all my dependencies from package.json.

It is recommended to run project in this order:
1. "node general/sync.js" to create tables for database.
2. "node epic games/save_games.js" to start collecting Epic Games data (games, news) and saving it to database.
3. "node steam/bd.js" to start collecting Steam games data and saving it to database.
4. "node steam/newsBD.js" to start collecting Steam news data and saving it to database.
5. "node web/server.js" to start web application. After that you can open browser and navigate to localhost:3030.
### Contributing
The project is being developed in collaboration with **[this awesome guy](https://t.me/akkr1_o_O)**!