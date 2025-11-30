import { execSync } from "child_process";

export default async function globalSetup() {
  // Set test database URL
  process.env.DATABASE_URL = "file:./test.db";

  // Run migrations on test database
  execSync("npx prisma migrate deploy", {
    env: { ...process.env, DATABASE_URL: "file:./test.db" },
    stdio: "inherit",
  });
}
