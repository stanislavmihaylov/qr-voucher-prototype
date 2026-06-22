import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { VoucherService } from '../voucher.service';
import { PrismaService } from '../../prisma/prisma.service';

const PRISMA_ROWS = [
  {
    id: 'v1',
    durationDays: 1,
    maxDevices: 2,
    priceGBP: '7.99',
    name: '1-day',
    description: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'v2',
    durationDays: 3,
    maxDevices: 4,
    priceGBP: '12.99',
    name: '3-day',
    description: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'v3',
    durationDays: 4,
    maxDevices: 6,
    priceGBP: '14.99',
    name: '4-day',
    description: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'v4',
    durationDays: 5,
    maxDevices: 8,
    priceGBP: '16.99',
    name: '5-day',
    description: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'v5',
    durationDays: 7,
    maxDevices: 10,
    priceGBP: '17.99',
    name: '7-day',
    description: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'v6',
    durationDays: 10,
    maxDevices: 12,
    priceGBP: '24.99',
    name: '10-day',
    description: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockPrisma = {
  wifiVoucher: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
};

describe('VoucherService', () => {
  let service: VoucherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoucherService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<VoucherService>(VoucherService);
    jest.clearAllMocks();
  });

  // Slice 1: findAll returns rows sorted by durationDays asc
  describe('findAll()', () => {
    it('should return all vouchers ordered by durationDays ascending', async () => {
      mockPrisma.wifiVoucher.findMany.mockResolvedValue(PRISMA_ROWS);

      const result = await service.findAll();

      expect(mockPrisma.wifiVoucher.findMany).toHaveBeenCalledWith({
        orderBy: { durationDays: 'asc' },
      });
      expect(result).toHaveLength(6);
      expect(result.map((v) => v.durationDays)).toEqual([1, 3, 4, 5, 7, 10]);
    });

    // Slice 2: priceGBP is serialized from Decimal string to JS number
    it('should convert priceGBP Decimal to a JS number', async () => {
      mockPrisma.wifiVoucher.findMany.mockResolvedValue(PRISMA_ROWS);

      const result = await service.findAll();

      result.forEach((v) => {
        expect(typeof v.priceGBP).toBe('number');
      });
      expect(result[0].priceGBP).toBe(7.99);
      expect(result[5].priceGBP).toBe(24.99);
    });

    it('should have varying maxDevices across rows', async () => {
      mockPrisma.wifiVoucher.findMany.mockResolvedValue(PRISMA_ROWS);

      const result = await service.findAll();

      const unique = new Set(result.map((v) => v.maxDevices));
      expect(unique.size).toBe(6);
    });
  });

  // Slice 3: findOne returns one row; throws NotFoundException for unknown id
  describe('findOne()', () => {
    it('should return a single voucher DTO', async () => {
      mockPrisma.wifiVoucher.findUnique.mockResolvedValue(PRISMA_ROWS[0]);

      const result = await service.findOne('v1');

      expect(result.id).toBe('v1');
      expect(result.durationDays).toBe(1);
      expect(result.maxDevices).toBe(2);
      expect(result.priceGBP).toBe(7.99);
    });

    it('should throw NotFoundException when voucher is not found', async () => {
      mockPrisma.wifiVoucher.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
