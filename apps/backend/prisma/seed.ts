import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const SEED_VOUCHERS = [
  { durationDays: 1, maxDevices: 2, priceGBP: 7.99, name: '1-day Wi-Fi voucher', description: '' },
  { durationDays: 3, maxDevices: 4, priceGBP: 12.99, name: '3-day Wi-Fi voucher', description: '' },
  { durationDays: 4, maxDevices: 6, priceGBP: 14.99, name: '4-day Wi-Fi voucher', description: '' },
  { durationDays: 5, maxDevices: 8, priceGBP: 16.99, name: '5-day Wi-Fi voucher', description: '' },
  { durationDays: 7, maxDevices: 10, priceGBP: 17.99, name: '7-day Wi-Fi voucher', description: '' },
  { durationDays: 10, maxDevices: 12, priceGBP: 24.99, name: '10-day Wi-Fi voucher', description: '' },
];

async function main() {
  console.log('Seeding WifiVoucher rows...');

  // Idempotent: wipe and re-create
  await prisma.wifiVoucher.deleteMany();
  await prisma.wifiVoucher.createMany({ data: SEED_VOUCHERS });

  const count = await prisma.wifiVoucher.count();
  console.log(`Seeded ${count} WifiVoucher rows.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
