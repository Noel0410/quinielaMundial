-- SCRIPT PARA INSERTAR TODOS LOS PARTIDOS DE LA FASE ELIMINATORIA (31 partidos)

DELETE FROM matches WHERE stage IN ('Dieciseisavos', 'Octavos', 'Cuartos', 'Semifinal', 'Final');

-- DIECISEISAVOS (match_order 1 to 16)
INSERT INTO matches (id, stage, match_order, home_team_id, away_team_id) VALUES
(gen_random_uuid(), 'Dieciseisavos', 1, (SELECT id FROM teams WHERE short_name = 'RSA'), (SELECT id FROM teams WHERE short_name = 'CAN')),
(gen_random_uuid(), 'Dieciseisavos', 2, (SELECT id FROM teams WHERE short_name = 'NED'), (SELECT id FROM teams WHERE short_name = 'MAR')),
(gen_random_uuid(), 'Dieciseisavos', 3, (SELECT id FROM teams WHERE short_name = 'GER'), (SELECT id FROM teams WHERE short_name = 'PAR')),
(gen_random_uuid(), 'Dieciseisavos', 4, (SELECT id FROM teams WHERE short_name = 'FRA'), (SELECT id FROM teams WHERE short_name = 'SWE')),
(gen_random_uuid(), 'Dieciseisavos', 5, (SELECT id FROM teams WHERE short_name = 'BEL'), (SELECT id FROM teams WHERE short_name = 'SEN')),
(gen_random_uuid(), 'Dieciseisavos', 6, (SELECT id FROM teams WHERE short_name = 'USA'), (SELECT id FROM teams WHERE short_name = 'BIH')),
(gen_random_uuid(), 'Dieciseisavos', 7, (SELECT id FROM teams WHERE short_name = 'ESP'), (SELECT id FROM teams WHERE short_name = 'AUT')),
(gen_random_uuid(), 'Dieciseisavos', 8, (SELECT id FROM teams WHERE short_name = 'POR'), (SELECT id FROM teams WHERE short_name = 'CRO')),

(gen_random_uuid(), 'Dieciseisavos', 9, (SELECT id FROM teams WHERE short_name = 'BRA'), (SELECT id FROM teams WHERE short_name = 'JPN')),
(gen_random_uuid(), 'Dieciseisavos', 10, (SELECT id FROM teams WHERE short_name = 'CIV'), (SELECT id FROM teams WHERE short_name = 'NOR')),
(gen_random_uuid(), 'Dieciseisavos', 11, (SELECT id FROM teams WHERE short_name = 'MEX'), (SELECT id FROM teams WHERE short_name = 'ECU')),
(gen_random_uuid(), 'Dieciseisavos', 12, (SELECT id FROM teams WHERE short_name = 'ENG'), (SELECT id FROM teams WHERE short_name = 'COD')),
(gen_random_uuid(), 'Dieciseisavos', 13, (SELECT id FROM teams WHERE short_name = 'SUI'), (SELECT id FROM teams WHERE short_name = 'ALG')),
(gen_random_uuid(), 'Dieciseisavos', 14, (SELECT id FROM teams WHERE short_name = 'COL'), (SELECT id FROM teams WHERE short_name = 'GHA')),
(gen_random_uuid(), 'Dieciseisavos', 15, (SELECT id FROM teams WHERE short_name = 'AUS'), (SELECT id FROM teams WHERE short_name = 'EGY')),
(gen_random_uuid(), 'Dieciseisavos', 16, (SELECT id FROM teams WHERE short_name = 'ARG'), (SELECT id FROM teams WHERE short_name = 'CPV'));

-- OCTAVOS (match_order 17 to 24)
INSERT INTO matches (id, stage, match_order, home_team_id, away_team_id) VALUES
(gen_random_uuid(), 'Octavos', 17, NULL, NULL),
(gen_random_uuid(), 'Octavos', 18, NULL, NULL),
(gen_random_uuid(), 'Octavos', 19, NULL, NULL),
(gen_random_uuid(), 'Octavos', 20, NULL, NULL),
(gen_random_uuid(), 'Octavos', 21, NULL, NULL),
(gen_random_uuid(), 'Octavos', 22, NULL, NULL),
(gen_random_uuid(), 'Octavos', 23, NULL, NULL),
(gen_random_uuid(), 'Octavos', 24, NULL, NULL);

-- CUARTOS (match_order 25 to 28)
INSERT INTO matches (id, stage, match_order, home_team_id, away_team_id) VALUES
(gen_random_uuid(), 'Cuartos', 25, NULL, NULL),
(gen_random_uuid(), 'Cuartos', 26, NULL, NULL),
(gen_random_uuid(), 'Cuartos', 27, NULL, NULL),
(gen_random_uuid(), 'Cuartos', 28, NULL, NULL);

-- SEMIFINAL (match_order 29 to 30)
INSERT INTO matches (id, stage, match_order, home_team_id, away_team_id) VALUES
(gen_random_uuid(), 'Semifinal', 29, NULL, NULL),
(gen_random_uuid(), 'Semifinal', 30, NULL, NULL);

-- Tercer lugar (match_order 31)
INSERT INTO matches (id, stage, match_order, home_team_id, away_team_id) VALUES
(gen_random_uuid(), 'Tercer lugar', 31, NULL, NULL);

-- FINAL (match_order 32)
INSERT INTO matches (id, stage, match_order, home_team_id, away_team_id) VALUES
(gen_random_uuid(), 'Final', 32, NULL, NULL);
