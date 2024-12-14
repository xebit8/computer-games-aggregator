$(document).ready(function () {
    // Обработчик для кнопки "Удалить из избранного"
    $('.remove-from-favourite').on('click', function () {
      const gameId = $(this).data('game-id'); // Получаем game_id из атрибута data
      const platformId = $(this).data('platform-id'); // Получаем platform_id из атрибута data
  
      // Отправляем DELETE-запрос на сервер
      $.ajax({
        url: '/favourites',
        method: 'DELETE',
        data: { game_id: gameId, platform_id: platformId },
        success: function (response) {
          alert('Игра удалена из избранного!');
          // Можно добавить логику для обновления интерфейса (например, удалить элемент из списка)
          $(this).closest('.item').remove(); // Удаляем элемент из списка
        }.bind(this),
        error: function () {
          alert('Ошибка при удалении игры из избранного.');
        }
      });
    });
  });