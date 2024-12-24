DROP VIEW steam_games_view;
DROP VIEW epic_games_view;

DROP TRIGGER trigger_steam_insert ON steam_games;
DROP TRIGGER trigger_steam_update ON steam_games;
DROP TRIGGER trigger_steam_delete ON steam_games;
DROP TRIGGER trigger_epic_insert ON epic_games;
DROP TRIGGER trigger_epic_update ON epic_games;
DROP TRIGGER trigger_epic_delete ON epic_games;

DROP PROCEDURE export_table_to_csv;

DROP FUNCTION function_insert;
DROP FUNCTION function_update;
DROP FUNCTION function_delete;
DROP FUNCTION filter_games_by_genre(genres TEXT, platform TEXT);