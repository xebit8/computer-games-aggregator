document.getElementsByClassName("ui button create").onclick = CreateGame;

function CreateGame() {
  const title = document.getElementsByClassName("title")[0].value;
  const description = document.getElementsByClassName("description")[0].value;
  const status = document.getElementsByClassName("status")[0].value;
  const content_type = document.getElementsByClassName("content_type")[0].value;
  const release_date = document.getElementsByClassName("release_date")[0].value;
  const genres = document.getElementsByClassName("genres")[0].value;
  const developer = document.getElementsByClassName("developer")[0].value;
  const publisher = document.getElementsByClassName("publisher")[0].value;
  const supported_os = document.getElementsByClassName("supported_os")[0].value;
  const supported_languages = document.getElementsByClassName("supported_languages")[0].value;
  const recommended_system_requirements = document.getElementsByClassName("recommended_system_requirements")[0].value;
  const min_system_requirements = document.getElementsByClassName("min_system_requirements")[0].value;
 
  const game = {
    "title": title || '-',
    "content_type": content_type || '-',
    "description": description || '-',
    "status": status || '-',
    "release_date": release_date || '-',
    "genres": genres || '-',
    "developer": developer || '-',
    "publisher": publisher || '-',
    "min_system_requirements": min_system_requirements || '-',
    "recommended_system_requirements": recommended_system_requirements || '-',
    "supported_languages": supported_languages || '-',
    "supported_os": supported_os || '-',
    "url": '-',
  }
  console.log(game);

  fetch('/steam/games/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(game),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Успех:', data);
    alert('Игра успешно создана!');
    window.history.back();
  })
  .catch((error) => {
    console.error('Ошибка:', error);
    alert('Произошла ошибка при создании игры.');
  });
}