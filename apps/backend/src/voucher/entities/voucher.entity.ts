// Documents the Prisma model shape for reference.
// The actual entity is managed by Prisma — do not create a TypeORM-style class here.
// See: apps/backend/prisma/schema.prisma — model WifiVoucher

export type VoucherEntity = {
  id: string;
  name: string;
  description: string;
  priceGBP: unknown; // Prisma Decimal
  durationDays: number;
  maxDevices: number;
  createdAt: Date;
  updatedAt: Date;
};
