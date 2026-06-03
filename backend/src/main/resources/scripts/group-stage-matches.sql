-- SCRIPT DE INSERCIÓN COMPLETO PARA LOS 72 PARTIDOS DE LA FASE DE GRUPOS
-- Nota: Usamos gen_random_uuid() para PostgreSQL. Si usas MySQL cámbialo por UUID().

INSERT INTO matches (id, stage, home_team_id, away_team_id, home_team_goals, away_team_goals) VALUES

-- === GRUPO A ===
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'MEX'), (SELECT id FROM teams WHERE short_name = 'RSA'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'KOR'), (SELECT id FROM teams WHERE short_name = 'CZE'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'MEX'), (SELECT id FROM teams WHERE short_name = 'KOR'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'CZE'), (SELECT id FROM teams WHERE short_name = 'RSA'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'CZE'), (SELECT id FROM teams WHERE short_name = 'MEX'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'RSA'), (SELECT id FROM teams WHERE short_name = 'KOR'), NULL, NULL),

-- === GRUPO B ===
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'CAN'), (SELECT id FROM teams WHERE short_name = 'BIH'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'QAT'), (SELECT id FROM teams WHERE short_name = 'SUI'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'CAN'), (SELECT id FROM teams WHERE short_name = 'QAT'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'SUI'), (SELECT id FROM teams WHERE short_name = 'BIH'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'SUI'), (SELECT id FROM teams WHERE short_name = 'CAN'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'BIH'), (SELECT id FROM teams WHERE short_name = 'QAT'), NULL, NULL),

-- === GRUPO C ===
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'BRA'), (SELECT id FROM teams WHERE short_name = 'MAR'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'HAI'), (SELECT id FROM teams WHERE short_name = 'SCO'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'BRA'), (SELECT id FROM teams WHERE short_name = 'HAI'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'SCO'), (SELECT id FROM teams WHERE short_name = 'MAR'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'SCO'), (SELECT id FROM teams WHERE short_name = 'BRA'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'MAR'), (SELECT id FROM teams WHERE short_name = 'HAI'), NULL, NULL),

-- === GRUPO D ===
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'USA'), (SELECT id FROM teams WHERE short_name = 'PAR'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'AUS'), (SELECT id FROM teams WHERE short_name = 'TUR'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'USA'), (SELECT id FROM teams WHERE short_name = 'AUS'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'TUR'), (SELECT id FROM teams WHERE short_name = 'PAR'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'TUR'), (SELECT id FROM teams WHERE short_name = 'USA'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'PAR'), (SELECT id FROM teams WHERE short_name = 'AUS'), NULL, NULL),

-- === GRUPO E ===
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'GER'), (SELECT id FROM teams WHERE short_name = 'CUW'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'CIV'), (SELECT id FROM teams WHERE short_name = 'ECU'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'GER'), (SELECT id FROM teams WHERE short_name = 'CIV'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'ECU'), (SELECT id FROM teams WHERE short_name = 'CUW'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'ECU'), (SELECT id FROM teams WHERE short_name = 'GER'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'CUW'), (SELECT id FROM teams WHERE short_name = 'CIV'), NULL, NULL),

-- === GRUPO F ===
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'NED'), (SELECT id FROM teams WHERE short_name = 'JPN'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'SWE'), (SELECT id FROM teams WHERE short_name = 'TUN'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'NED'), (SELECT id FROM teams WHERE short_name = 'SWE'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'TUN'), (SELECT id FROM teams WHERE short_name = 'JPN'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'TUN'), (SELECT id FROM teams WHERE short_name = 'NED'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'JPN'), (SELECT id FROM teams WHERE short_name = 'SWE'), NULL, NULL),

-- === GRUPO G ===
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'BEL'), (SELECT id FROM teams WHERE short_name = 'EGY'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'IRN'), (SELECT id FROM teams WHERE short_name = 'NZL'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'BEL'), (SELECT id FROM teams WHERE short_name = 'IRN'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'NZL'), (SELECT id FROM teams WHERE short_name = 'EGY'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'NZL'), (SELECT id FROM teams WHERE short_name = 'BEL'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'EGY'), (SELECT id FROM teams WHERE short_name = 'IRN'), NULL, NULL),

-- === GRUPO H ===
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'ESP'), (SELECT id FROM teams WHERE short_name = 'CPV'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'KSA'), (SELECT id FROM teams WHERE short_name = 'URU'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'ESP'), (SELECT id FROM teams WHERE short_name = 'KSA'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'URU'), (SELECT id FROM teams WHERE short_name = 'CPV'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'URU'), (SELECT id FROM teams WHERE short_name = 'ESP'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'CPV'), (SELECT id FROM teams WHERE short_name = 'KSA'), NULL, NULL),

-- === GRUPO I ===
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'FRA'), (SELECT id FROM teams WHERE short_name = 'SEN'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'IRQ'), (SELECT id FROM teams WHERE short_name = 'NOR'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'FRA'), (SELECT id FROM teams WHERE short_name = 'IRQ'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'NOR'), (SELECT id FROM teams WHERE short_name = 'SEN'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'NOR'), (SELECT id FROM teams WHERE short_name = 'FRA'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'SEN'), (SELECT id FROM teams WHERE short_name = 'IRQ'), NULL, NULL),

-- === GRUPO J ===
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'ARG'), (SELECT id FROM teams WHERE short_name = 'ALG'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'AUT'), (SELECT id FROM teams WHERE short_name = 'JOR'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'ARG'), (SELECT id FROM teams WHERE short_name = 'AUT'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'JOR'), (SELECT id FROM teams WHERE short_name = 'ALG'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'JOR'), (SELECT id FROM teams WHERE short_name = 'ARG'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'ALG'), (SELECT id FROM teams WHERE short_name = 'AUT'), NULL, NULL),

-- === GRUPO K ===
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'POR'), (SELECT id FROM teams WHERE short_name = 'COD'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'UZB'), (SELECT id FROM teams WHERE short_name = 'COL'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'POR'), (SELECT id FROM teams WHERE short_name = 'UZB'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'COL'), (SELECT id FROM teams WHERE short_name = 'COD'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'COL'), (SELECT id FROM teams WHERE short_name = 'POR'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'COD'), (SELECT id FROM teams WHERE short_name = 'UZB'), NULL, NULL),

-- === GRUPO L ===
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'ENG'), (SELECT id FROM teams WHERE short_name = 'CRO'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'GHA'), (SELECT id FROM teams WHERE short_name = 'PAN'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'ENG'), (SELECT id FROM teams WHERE short_name = 'GHA'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'PAN'), (SELECT id FROM teams WHERE short_name = 'CRO'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'PAN'), (SELECT id FROM teams WHERE short_name = 'ENG'), NULL, NULL),
(gen_random_uuid(), 'Fase de Grupos', (SELECT id FROM teams WHERE short_name = 'CRO'), (SELECT id FROM teams WHERE short_name = 'GHA'), NULL, NULL);