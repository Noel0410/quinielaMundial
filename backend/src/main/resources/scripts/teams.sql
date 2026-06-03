-- Si estás usando PostgreSQL, puedes usar gen_random_uuid() para poblar el ID automáticamente
-- Si usas MySQL, cambia gen_random_uuid() por UUID()

INSERT INTO teams (id, name, short_name, group_name) VALUES
-- GRUPO A
(gen_random_uuid(), 'México', 'MEX', 'A'),
(gen_random_uuid(), 'Sudáfrica', 'RSA', 'A'),
(gen_random_uuid(), 'Corea del Sur', 'KOR', 'A'),
(gen_random_uuid(), 'República Checa', 'CZE', 'A'),

-- GRUPO B
(gen_random_uuid(), 'Canadá', 'CAN', 'B'),
(gen_random_uuid(), 'Bosnia y Herzegovina', 'BIH', 'B'),
(gen_random_uuid(), 'Catar', 'QAT', 'B'),
(gen_random_uuid(), 'Suiza', 'SUI', 'B'),

-- GRUPO C
(gen_random_uuid(), 'Brasil', 'BRA', 'C'),
(gen_random_uuid(), 'Marruecos', 'MAR', 'C'),
(gen_random_uuid(), 'Haití', 'HAI', 'C'),
(gen_random_uuid(), 'Escocia', 'SCO', 'C'),

-- GRUPO D
(gen_random_uuid(), 'Estados Unidos', 'USA', 'D'),
(gen_random_uuid(), 'Paraguay', 'PAR', 'D'),
(gen_random_uuid(), 'Australia', 'AUS', 'D'),
(gen_random_uuid(), 'Turquía', 'TUR', 'D'),

-- GRUPO E
(gen_random_uuid(), 'Alemania', 'GER', 'E'),
(gen_random_uuid(), 'Curazao', 'CUW', 'E'),
(gen_random_uuid(), 'Costa de Marfil', 'CIV', 'E'),
(gen_random_uuid(), 'Ecuador', 'ECU', 'E'),

-- GRUPO F
(gen_random_uuid(), 'Países Bajos', 'NED', 'F'),
(gen_random_uuid(), 'Japón', 'JPN', 'F'),
(gen_random_uuid(), 'Suecia', 'SWE', 'F'),
(gen_random_uuid(), 'Túnez', 'TUN', 'F'),

-- GRUPO G
(gen_random_uuid(), 'Bélgica', 'BEL', 'G'),
(gen_random_uuid(), 'Egipto', 'EGY', 'G'),
(gen_random_uuid(), 'Irán', 'IRN', 'G'),
(gen_random_uuid(), 'Nueva Zelanda', 'NZL', 'G'),

-- GRUPO H
(gen_random_uuid(), 'España', 'ESP', 'H'),
(gen_random_uuid(), 'Cabo Verde', 'CPV', 'H'),
(gen_random_uuid(), 'Arabia Saudita', 'KSA', 'H'),
(gen_random_uuid(), 'Uruguay', 'URU', 'H'),

-- GRUPO I
(gen_random_uuid(), 'Francia', 'FRA', 'I'),
(gen_random_uuid(), 'Senegal', 'SEN', 'I'),
(gen_random_uuid(), 'Irak', 'IRQ', 'I'),
(gen_random_uuid(), 'Noruega', 'NOR', 'I'),

-- GRUPO J
(gen_random_uuid(), 'Argentina', 'ARG', 'J'),
(gen_random_uuid(), 'Argelia', 'ALG', 'J'),
(gen_random_uuid(), 'Austria', 'AUT', 'J'),
(gen_random_uuid(), 'Jordania', 'JOR', 'J'),

-- GRUPO K
(gen_random_uuid(), 'Portugal', 'POR', 'K'),
(gen_random_uuid(), 'República Democrática del Congo', 'COD', 'K'),
(gen_random_uuid(), 'Uzbekistán', 'UZB', 'K'),
(gen_random_uuid(), 'Colombia', 'COL', 'K'),

-- GRUPO L
(gen_random_uuid(), 'Inglaterra', 'ENG', 'L'),
(gen_random_uuid(), 'Croacia', 'CRO', 'L'),
(gen_random_uuid(), 'Ghana', 'GHA', 'L'),
(gen_random_uuid(), 'Panamá', 'PAN', 'L');