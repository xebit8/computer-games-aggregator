$(document).ready(function () {
  function checkIfFavourite(gameId, platformId) {
    return $.get('/favourites/check', { game_id: gameId, platform_id: platformId })
      .then(function (response) {
        return response.isFavourite;
      })
      .catch(function () {
        return false;
      });
  }

  $('.add-to-favourite').each(async function () {
    const gameId = $(this).data('game-id');
    const platformId = $(this).data('platform-id');

    const isFavourite = await checkIfFavourite(gameId, platformId);

    if (isFavourite) {
      $(this).prop('disabled', true);
    } else {
      $(this).addClass('grey');
    }
  });

  $('.add-to-favourite').on('click', function () {
    const gameId = $(this).data('game-id');
    const platformId = $(this).data('platform-id');

    $.post('/favourites', { game_id: gameId, platform_id: platformId }, function (response) {
      alert('Игра добавлена в избранное!');
      $(this).prop('disabled', true);
    }).fail(function () {
      alert('Ошибка при добавлении игры в избранное.');
    });
  });
});