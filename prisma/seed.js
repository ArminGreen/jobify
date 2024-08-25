const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const data = require("./MOCK_DATA.json");

async function main() {
  const clerkId = "user_2kuJemfk0TFZBPhYGdbEtsUuj04";

  const jobs = data.map((job) => {
    return {
      ...job,
      clerkId,
    };
  });
  for (const job of jobs) {
    await prisma.job.create({
      data: job,
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
