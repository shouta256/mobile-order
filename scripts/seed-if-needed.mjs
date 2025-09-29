import { execSync } from "node:child_process";

// Skip seeding when explicitly requested (e.g., production CI)
if (process.env.NEXT_SKIP_SEED === "1") {
  console.log("Skipping seed because NEXT_SKIP_SEED=1");
  process.exit(0);
}

try {
  execSync("node ./prisma/seed.js", { stdio: "inherit" });
} catch (error) {
  console.warn("Seed script failed, continuing build");
}
