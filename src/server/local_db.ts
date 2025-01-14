import pg from "pg"

// local setup
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "workplace_m_data",
    password: "P05tB7ad3$",
    port: 5432
});

export default db;