import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const regs = await prisma.registration.findMany({ include: { team: true } })
  console.log('Registrations:', regs.length);
  if (regs.length === 0) return console.log('No reg found');
  
  const reg = regs[0];
  console.log('Trying to delete', reg.id);
  
  try {
    if (reg.teamId) {
      await prisma.team.delete({ where: { id: reg.teamId } })
      console.log('Team deleted');
    } else {
      await prisma.registration.delete({ where: { id: reg.id } })
      console.log('Reg deleted');
    }
  } catch (e) {
    console.error('Error:', e)
  }
}
main().finally(() => prisma.$disconnect())
