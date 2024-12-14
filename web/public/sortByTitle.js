$(document).ready(function () {
    // Обработчик для кнопки "Сортировать по алфавиту"
    $('.epic-theme .sort-button').on('click', function () {
      // Отправляем GET-запрос на сервер для сортировки
      $.get('/epicgames/sort-by-title', function (response) {
        // Очищаем текущий список игр
        $('.ui.link.items').empty();
  
        // Добавляем отсортированные игры в список
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

    $('.steam-theme .sort-button').on('click', function () {
        // Отправляем GET-запрос на сервер для сортировки
        $.get('/steam/sort-by-title', function (response) {
          // Очищаем текущий список игр
          $('.ui.link.items').empty();
    
          // Добавляем отсортированные игры в список
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