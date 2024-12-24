SELECT * FROM pg_available_extensions WHERE name LIKE '%python%' ORDER BY name;

CREATE OR REPLACE FUNCTION return_version()
  RETURNS VARCHAR
AS $$
    import sys
    return sys.version
$$ LANGUAGE plpython3u;

SELECT * FROM return_version();

DROP FUNCTION return_version;