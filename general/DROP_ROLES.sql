REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM administrator;
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM administrator;

REVOKE SELECT ON ALL TABLES IN SCHEMA public FROM analyst;

REVOKE administrator FROM "michael.kovach99@mail.ru";
REVOKE analyst FROM "adam.brightman100@mail.ru";

DROP ROLE "michael.kovach99@mail.ru";
DROP ROLE "adam.brightman100@mail.ru";

DROP ROLE administrator;
DROP ROLE analyst;