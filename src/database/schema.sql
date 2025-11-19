-- Crear base de datos
CREATE DATABASE boticare;

\c boticare;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
                                     id UUID PRIMARY KEY,
                                     name VARCHAR(50) NOT NULL,
                                     lastname VARCHAR(50) NOT NULL,
                                     email  VARCHAR(255) UNIQUE NOT NULL,
                                     cel  VARCHAR(20),
                                     birthdate DATE,
                                     photo TEXT,
                                     created_at TIMESTAMPTZ DEFAULT NOW(),
                                     updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS auth (
                                    id UUID PRIMARY KEY,
                                    user_id UUID NOT NULL UNIQUE,
                                    password TEXT NOT NULL,
                                    role TEXT[] DEFAULT ARRAY['user'],
    -- timestamptz guarda fecha con zona horaria utc
                                    last_login TIMESTAMPTZ,
                                    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- relacion tabla user
                                    CONSTRAINT fk_auth_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);