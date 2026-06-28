-- SCRIPT PARA INSERTAR LOS PARTIDOS DE DIECISEISAVOS DE FINAL (16VOS)
-- Basado en los cruces mostrados en el diseño del bracket

INSERT INTO matches (id, stage, home_team_id, away_team_id, home_team_goals, away_team_goals) VALUES

-- LADO IZQUIERDO DEL BRACKET
(gen_random_uuid(), 'Dieciseisavos', (SELECT id FROM teams WHERE short_name = 'GER'), (SELECT id FROM teams WHERE short_name = 'SCO'), NULL, NULL),
(gen_random_uuid(), 'Dieciseisavos', (SELECT id FROM teams WHERE short_name = 'FRA'), (SELECT id FROM teams WHERE short_name = 'SWE'), NULL, NULL),
(gen_random_uuid(), 'Dieciseisavos', (SELECT id FROM teams WHERE short_name = 'KOR'), (SELECT id FROM teams WHERE short_name = 'CAN'), NULL, NULL),
(gen_random_uuid(), 'Dieciseisavos', (SELECT id FROM teams WHERE short_name = 'NED'), (SELECT id FROM teams WHERE short_name = 'MAR'), NULL, NULL),
(gen_random_uuid(), 'Dieciseisavos', (SELECT id FROM teams WHERE short_name = 'POR'), (SELECT id FROM teams WHERE short_name = 'GHA'), NULL, NULL),
(gen_random_uuid(), 'Dieciseisavos', (SELECT id FROM teams WHERE short_name = 'ESP'), (SELECT id FROM teams WHERE short_name = 'AUT'), NULL, NULL),
(gen_random_uuid(), 'Dieciseisavos', (SELECT id FROM teams WHERE short_name = 'USA'), (SELECT id FROM teams WHERE short_name = 'BIH'), NULL, NULL),
(gen_random_uuid(), 'Dieciseisavos', (SELECT id FROM teams WHERE short_name = 'EGY'), (SELECT id FROM teams WHERE short_name = 'CZE'), NULL, NULL),

-- LADO DERECHO DEL BRACKET
(gen_random_uuid(), 'Dieciseisavos', (SELECT id FROM teams WHERE short_name = 'BRA'), (SELECT id FROM teams WHERE short_name = 'JPN'), NULL, NULL),
(gen_random_uuid(), 'Dieciseisavos', (SELECT id FROM teams WHERE short_name = 'CIV'), (SELECT id FROM teams WHERE short_name = 'NOR'), NULL, NULL),
(gen_random_uuid(), 'Dieciseisavos', (SELECT id FROM teams WHERE short_name = 'MEX'), (SELECT id FROM teams WHERE short_name = 'CPV'), NULL, NULL),
(gen_random_uuid(), 'Dieciseisavos', (SELECT id FROM teams WHERE short_name = 'ENG'), (SELECT id FROM teams WHERE short_name = 'ECU'), NULL, NULL),
(gen_random_uuid(), 'Dieciseisavos', (SELECT id FROM teams WHERE short_name = 'ARG'), (SELECT id FROM teams WHERE short_name = 'URU'), NULL, NULL),
(gen_random_uuid(), 'Dieciseisavos', (SELECT id FROM teams WHERE short_name = 'AUS'), (SELECT id FROM teams WHERE short_name = 'IRN'), NULL, NULL),
(gen_random_uuid(), 'Dieciseisavos', (SELECT id FROM teams WHERE short_name = 'SUI'), (SELECT id FROM teams WHERE short_name = 'BEL'), NULL, NULL),
(gen_random_uuid(), 'Dieciseisavos', (SELECT id FROM teams WHERE short_name = 'COL'), (SELECT id FROM teams WHERE short_name = 'PAR'), NULL, NULL);
