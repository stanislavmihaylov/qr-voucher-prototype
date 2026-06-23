// Documents the Prisma model shape for reference.
// The actual entity is managed by Prisma — do not create a TypeORM-style class here.
// See: apps/backend/prisma/schema.prisma — model Purchase

export type PurchaseEntity = {
  id: string;
  voucherId: string;
  qrCodeData: string;
  status: 'PENDING' | 'COMPLETED' | 'ERROR';
  createdAt: Date;
  updatedAt: Date;
};
