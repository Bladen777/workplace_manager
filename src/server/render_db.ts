import pg from "pg"

export const render_db = new pg.Pool({
    connectionString: process.env.db_conn_link,
    ssl: {
        rejectUnauthorized: false
    }
})

