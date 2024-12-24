CREATE ROLE administrator;
CREATE ROLE analyst;

CREATE ROLE "michael.kovach99@mail.ru" WITH LOGIN PASSWORD 'kovach2000';
CREATE ROLE "adam.brightman100@mail.ru" WITH LOGIN PASSWORD 'brightman1998';

GRANT administrator TO "michael.kovach99@mail.ru";
GRANT analyst TO "adam.brightman100@mail.ru";

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO administrator;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO administrator;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO administrator;
GRANT ALL PRIVILEGES ON ALL PROCEDURES IN SCHEMA public TO administrator;
GRANT ALL PRIVILEGES ON ALL VIEWS IN SCHEMA public TO administrator;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO analyst;
GRANT SELECT ON ALL FUNCTIONS IN SCHEMA public to analyst;
GRANT SELECT ON ALL PROCEDURES IN SCHEMA public to analyst;
GRANT SELECT ON ALL VIEWS IN SCHEMA public TO analyst;