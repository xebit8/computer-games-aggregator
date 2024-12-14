$(document).ready(function () {
    // Обработчик для кнопки "Показать игры, поддерживающие США"
    $('.epic-theme .filter-button').on('click', function () {
      // Отправляем GET-запрос на сервер для фильтрации
      $.get('/epicgames/filter-by-supported-os', function (response) {
        // Очищаем текущий список игр
        $('.ui.link.items').empty();
  
        // Добавляем отфильтрованные игры в список
        response.games.forEach(game => {
          const item = `
            <div class="item">
              <div class="ui tiny image">
                <img class="ui mini image" src="../res/game_thumbnail.png"></img>
              </div>
              <div class="content">
                <div class="header">${game.title}</div>
                <div class="description">
                  <p>${game.description}</p>
                </div>
              </div>
            </div>
          `;
          $('.ui.link.items').append(item);
        });
      });
    });
    $('.steam-theme .filter-button').on('click', function () {
        // Отправляем GET-запрос на сервер для фильтрации
        $.get('/steam/filter-by-supported-os', function (response) {
          // Очищаем текущий список игр
          $('.ui.link.items').empty();
    
          // Добавляем отфильтрованные игры в список
          response.games.forEach(game => {
            const item = `
              <div class="item">
                <div class="ui tiny image">
                  <img class="ui mini image" src="../res/game_thumbnail.png"></img>
                </div>
                <div class="content">
                  <div class="header">${game.title}</div>
                  <div class="description">
                    <p>${game.description}</p>
                  </div>
                </div>
              </div>
            `;
            $('.ui.link.items').append(item);
          });
        });
    });
  });