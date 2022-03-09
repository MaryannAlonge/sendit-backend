import * as pg from "pg";
const { Pool } = pg.default;

const pool = new Pool({
  user: "postgres",
  password: "",
  host: "localhost",
  port: 5432,
  database: "my_sendit",
});

export default pool;
