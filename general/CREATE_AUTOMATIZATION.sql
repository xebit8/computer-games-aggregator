-- Функция для INSERT
CREATE OR REPLACE FUNCTION function_insert()
RETURNS TRIGGER AS $$
BEGIN
    -- Определяем платформу
    IF TG_TABLE_NAME = 'steam_games' THEN
        INSERT INTO games_logs (game_id, type_event, platform_type)
        VALUES (NEW.id, 'INSERT', 'Steam');
    ELSIF TG_TABLE_NAME = 'epic_games' THEN
        INSERT INTO games_logs (game_id, type_event, platform_type)
        VALUES (NEW.id, 'INSERT', 'Epic Games');
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Функция для UPDATE
CREATE OR REPLACE FUNCTION function_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Определяем платформу
    IF TG_TABLE_NAME = 'steam_games' THEN
        INSERT INTO games_logs (game_id, type_event, platform_type)
        VALUES (NEW.id, 'UPDATE', 'Steam');
    ELSIF TG_TABLE_NAME = 'epic_games' THEN
        INSERT INTO games_logs (game_id, type_event, platform_type)
        VALUES (NEW.id, 'UPDATE', 'Epic Games');
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Функция для DELETE
CREATE OR REPLACE FUNCTION function_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- Определяем платформу
    IF TG_TABLE_NAME = 'steam_games' THEN
        INSERT INTO games_logs (game_id, type_event, platform_type)
        VALUES (OLD.id, 'DELETE', 'Steam');
    ELSIF TG_TABLE_NAME = 'epic_games' THEN
        INSERT INTO games_logs (game_id, type_event, platform_type)
        VALUES (OLD.id, 'DELETE', 'Epic Games');
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Функция для фильтрации игр по жанрам
CREATE OR REPLACE FUNCTION filter_games_by_genre(input_genres TEXT, platform TEXT)
RETURNS TABLE (
	id INT,
    title TEXT,
    description TEXT,
    image_url TEXT,
	genres TEXT
)
AS $$
	genres_array = input_genres.split(', ')
	response = []
	
	if platform == "Steam":
		query = "SELECT id, title, description, image_url, genres FROM steam_games WHERE "
	elif platform == "Epic Games":
		query = "SELECT id, title, description, image_url, genres FROM epic_games WHERE "
	conditions = " AND ".join([f"genres LIKE '%{genre}%'" for genre in genres_array])
	query += conditions
	filtered_games = plpy.execute(query)
	for game in filtered_games:
		response.append((game["id"], game["title"], game["description"], game["image_url"], game["genres"]))
	return response
$$ LANGUAGE plpython3u;

-- Процедура экспорта данных таблицы в CSV файл
CREATE PROCEDURE export_table_to_csv("table" TEXT, "filename" TEXT)
AS $$
BEGIN
  EXECUTE FORMAT('COPY %I TO %L WITH CSV DELIMITER '','' ENCODING ''UTF8'' HEADER', "table", "filename");
END;
$$ LANGUAGE plpgsql;

-- Триггеры для таблицы steam_games
CREATE TRIGGER trigger_steam_insert
AFTER INSERT ON steam_games
FOR EACH ROW
EXECUTE FUNCTION function_insert();

CREATE TRIGGER trigger_steam_update
AFTER UPDATE ON steam_games
FOR EACH ROW
EXECUTE FUNCTION function_update();

CREATE TRIGGER trigger_steam_delete
AFTER DELETE ON steam_games
FOR EACH ROW
EXECUTE FUNCTION function_delete();

-- Триггеры для таблицы epic_games
CREATE TRIGGER trigger_epic_insert
AFTER INSERT ON epic_games
FOR EACH ROW
EXECUTE FUNCTION function_insert();

CREATE TRIGGER trigger_epic_update
AFTER UPDATE ON epic_games
FOR EACH ROW
EXECUTE FUNCTION function_update();

CREATE TRIGGER trigger_epic_delete
AFTER DELETE ON epic_games
FOR EACH ROW
EXECUTE FUNCTION function_delete();

CREATE OR REPLACE VIEW steam_games_view AS
SELECT 
    sg.id, 
    sg.title, 
    content_type, 
    sg.description,
    sg.status,
    sg.release_date,
    sg.genres,
    d.name AS developer,
    p.name AS publisher, 
    sg.min_system_requirements,
    sg.recommended_system_requirements,
    sg.supported_os,
    sg.supported_languages,
	sg.image_url,
    sg.url
FROM steam_games sg, publishers p, developers d
WHERE sg.developer_id = d.id AND sg.publisher_id = p.id;

CREATE OR REPLACE VIEW epic_games_view AS
SELECT 
    eg.id, 
    eg.title, 
    content_type, 
    eg.description,
    eg.status,
    eg.release_date,
    eg.genres,
    d.name AS developer,
    p.name AS publisher, 
    eg.supported_os,
	eg.image_url,
    eg.url
FROM epic_games eg, publishers p, developers d
WHERE eg.developer_id = d.id AND eg.publisher_id = p.id;