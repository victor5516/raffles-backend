import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/crypto';
import { generateUUID } from '../src/utils/uuid';

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.error('Usage: ts-node scripts/createAdmin.ts <email> <password> <full_name>');
    process.exit(1);
  }

  const [email, password, fullName] = args;

  try {
    const passwordHash = await hashPassword(password);
    const admin = await prisma.admin.create({
      data: {
        uid: generateUUID(),
        email,
        full_name: fullName,
        password_hash: passwordHash,
      },
    });
    console.log('Admin created successfully:', admin);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
