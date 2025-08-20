-- Crear base de datos
CREATE DATABASE boticare;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
                                     id UUID PRIMARY KEY,
                                     name VARCHAR(100) NOT NULL,
                                     lastname VARCHAR(100) NOT NULL,
                                     cel  VARCHAR(20) NOT NULL,
                                     email VARCHAR(255) UNIQUE,
                                     photo TEXT,
                                     created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de ubicaciones de cada usuario
--- una ubicacion por usuario
CREATE TABLE IF NOT EXISTS ubication (
                                         id UUID PRIMARY KEY,
                                         user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
                                         country VARCHAR(100) NOT NULL CHECK ( country = 'Colombia' ),
                                         city VARCHAR(100) NOT NULL,
                                         zone VARCHAR(100),
                                         created_at TIMESTAMP DEFAULT NOW()
);