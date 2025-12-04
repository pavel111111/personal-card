import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || "ec2-13-49-243-0.eu-north-1.compute.amazonaws.com",
  user: process.env.DB_USER || "kpv",
  password: process.env.DB_PASS || "tomcat",
  database: process.env.DB_NAME || "sdk_3101",
  port: Number(process.env.DB_PORT) || 5454,
});

export default pool;
