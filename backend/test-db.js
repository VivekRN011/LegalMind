require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Prisma connected successfully!');
    
    const userCount = await prisma.user.count();
    console.log('📊 User count:', userCount);
    
    const docCount = await prisma.document.count();
    console.log('📄 Document count:', docCount);
    
    console.log('\n✅ Database setup complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
