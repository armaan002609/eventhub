const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.hackathon.findMany().then(res => {
  console.log(res.map(h => ({id: h.id, title: h.title, imagePath: h.imagePath})));
  prisma.$disconnect();
});
