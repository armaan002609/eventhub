const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } });
  const vol = await prisma.user.findFirst({ where: { role: 'VOLUNTEER' } });

  console.log("Admin:", admin?.id, "Vol:", vol?.id);

  try {
    const duty = await prisma.duty.create({
      data: {
        title: "Test",
        venue: "Test Venue",
        startsAt: new Date("2026-10-01T09:30"),
        endsAt: new Date("2026-10-01T10:30"),
        level: 'TASK',
        createdById: admin.id,
        assignedToId: vol.id,
      }
    });
    console.log("Success:", duty);
  } catch (e) {
    console.error("Error:", e);
  }
}

main().finally(() => prisma.$disconnect());
