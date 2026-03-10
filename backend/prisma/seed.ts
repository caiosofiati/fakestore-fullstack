import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as bcrypt from 'bcrypt';
import * as path from 'path';

const dbPath = path.resolve(process.cwd(), 'dev.db');
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      password: adminPassword,
      firstname: 'Admin',
      lastname: 'User',
      role: 'ADMIN',
    },
  });

  const normalUser = await prisma.user.upsert({
    where: { username: 'user' },
    update: {},
    create: {
      email: 'user@example.com',
      username: 'user',
      password: userPassword,
      firstname: 'Normal',
      lastname: 'User',
      role: 'USER',
    },
  });

  console.log({ admin, normalUser });

  // Busca os produtos iniciais da API do Fakestore para popular nosso banco local
  console.log('Buscando produtos da FakeStore API...');
  const res = await fetch('https://fakestoreapi.com/products');

  interface FakeStoreProduct {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
  }

  const products = (await res.json()) as FakeStoreProduct[];

  console.log(`Semeando ${products.length} produtos...`);
  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {},
      create: {
        id: product.id,
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
      },
    });
  }
  console.log('Products seeded successfully.');
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
