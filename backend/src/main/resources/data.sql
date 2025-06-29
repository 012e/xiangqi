INSERT INTO game_types (id, type_name, time_control)
VALUES (1, 'Test 10s', 10 * 1000),
       (2, 'Test 30s', 30 * 1000),
       (3, 'Blitz 3m', 60 * 3 * 1000),
       (4, 'Blitz 5m', 60 * 5 * 1000),
       (5, 'Rapid 10m', 10 * 60 * 1000)
ON CONFLICT (id) DO UPDATE
    SET type_name    = EXCLUDED.type_name,
        time_control = EXCLUDED.time_control;

INSERT INTO users (id, username, email, openid_sub, display_name)
VALUES (nextval('users_id_seq'), 'Bot', 'bot@gmail.com', 'Bot', 'Bot')
ON CONFLICT (id) DO UPDATE SET username     = EXCLUDED.username,
                               email        = EXCLUDED.email,
                               openid_sub   = EXCLUDED.openid_sub,
                               display_name = EXCLUDED.display_name;