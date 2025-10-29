import { Pool } from 'pg'
import { config } from '../core/config/config.js'

const pool = new Pool({
    user: config.postgresql.user,
    password: config.postgresql.password,
    host: config.postgresql.host,
    port: Number(config.postgresql.port),
    database: config.postgresql.database
})

function handleConnection() {
    pool.connect()
        .then(client => {
            console.log('[DB Connected] Successfully connected to PostgreSQL')
            // siempre devolver cliente al pool
            client.release()
        })
        .catch(err => {
            console.error('[Error DB connection]: ', err.message)
            // reintentar despues de 2 segundos
            setTimeout(handleConnection, 2000)
        })

    pool.on('error', (err) => {
            console.error('[DB Error] ', err.message)
        // No se fuerza la reconeccion aqui porque pool lo maneja, la reconecion
    })
}

handleConnection()

export default pool