import fs from "fs";
import path from "path";

export default async function globalTeardown() {
  // Remove test database file
  const testDbPath = path.join(process.cwd(), "test.db");
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
}
