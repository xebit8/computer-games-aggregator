$(document).ready(function () {
  function checkIfFavourite(game_id, platform) {
    return $.get('/favourites/check', { game_id: game_id, platform: platform })
      .then(function (response) {
        return response.isFavourite;
      })
      .catch(function () {
        return false;
      });
  }

  $('.add-to-favourite').each(async function () {
    const game_id = $(this).data('game-id');
    const platform = $(this).data('platform');

    const isFavourite = await checkIfFavourite(game_id, platform);

    if (isFavourite) {
      $(this).prop('disabled', true);
    } else {
      $(this).addClass('red');
    }
  });

  $('.add-to-favourite').on('click', function () {
    const game_id = $(this).data('game-id');
    const platform = $(this).data('platform');

    $.post('/favourites', { game_id: game_id, platform: platform }, function (response) {
      alert('Игра добавлена в избранное!');
      $(this).prop('disabled', true);
    }).fail(function () {
      alert('Ошибка при добавлении игры в избранное.');
    });
  });
});