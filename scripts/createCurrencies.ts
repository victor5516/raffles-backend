import { PrismaClient } from '@prisma/client';
import { generateUUID } from '../src/utils/uuid';

const prisma = new PrismaClient();
const currencies = [
  {
    uid: generateUUID(),
    name: 'Bolívar',
    symbol: 'VES',
    value: 1,
  },
  {
    uid: generateUUID(),
    name: 'Dólar Estadounidense',
    symbol: 'USD',
    value: 1,
  },
];
async function main() {
  try {
    await prisma.currency.createMany({ data: currencies });
    console.log('Currencies created successfully');
  } catch (error) {
    console.error('Error creating currencies:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();