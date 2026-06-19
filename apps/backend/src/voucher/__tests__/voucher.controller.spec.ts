import { Test, TestingModule } from '@nestjs/testing';
import { VoucherController } from '../voucher.controller';
import { VoucherService } from '../voucher.service';
import { NotFoundException } from '@nestjs/common';

const MOCK_VOUCHERS = [
  { id: 'v1', durationDays: 1, maxDevices: 2, priceGBP: 7.99 },
  { id: 'v2', durationDays: 3, maxDevices: 4, priceGBP: 12.99 },
  { id: 'v3', durationDays: 4, maxDevices: 6, priceGBP: 14.99 },
  { id: 'v4', durationDays: 5, maxDevices: 8, priceGBP: 16.99 },
  { id: 'v5', durationDays: 7, maxDevices: 10, priceGBP: 17.99 },
  { id: 'v6', durationDays: 10, maxDevices: 12, priceGBP: 24.99 },
];

const mockVoucherService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
};

describe('VoucherController', () => {
  let controller: VoucherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoucherController],
      providers: [{ provide: VoucherService, useValue: mockVoucherService }],
    }).compile();

    controller = module.get<VoucherController>(VoucherController);
    jest.clearAllMocks();
  });

  // Slice 1: GET /api/vouchers returns all rows sorted by durationDays asc
  describe('findAll()', () => {
    it('should return all vouchers sorted by durationDays ascending', async () => {
      mockVoucherService.findAll.mockResolvedValue(MOCK_VOUCHERS);

      const result = await controller.findAll();

      expect(result).toHaveLength(6);
      const days = result.map((v) => v.durationDays);
      expect(days).toEqual([1, 3, 4, 5, 7, 10]);
    });

    // Slice 2: each item exposes durationDays, maxDevices, priceGBP (number) — maxDevices varies
    it('should expose durationDays, maxDevices, priceGBP on each item', async () => {
      mockVoucherService.findAll.mockResolvedValue(MOCK_VOUCHERS);

      const result = await controller.findAll();

      result.forEach((v) => {
        expect(typeof v.durationDays).toBe('number');
        expect(typeof v.maxDevices).toBe('number');
        expect(typeof v.priceGBP).toBe('number');
      });
    });

    it('should have varying maxDevices across rows (not all equal)', async () => {
      mockVoucherService.findAll.mockResolvedValue(MOCK_VOUCHERS);

      const result = await controller.findAll();

      const deviceCounts = result.map((v) => v.maxDevices);
      const unique = new Set(deviceCounts);
      expect(unique.size).toBeGreaterThan(1);
    });
  });

  // Slice 3: GET /api/vouchers/:id returns one row; unknown id → 404
  describe('findOne()', () => {
    it('should return a single voucher by id', async () => {
      mockVoucherService.findOne.mockResolvedValue(MOCK_VOUCHERS[0]);

      const result = await controller.findOne('v1');

      expect(result).toEqual(MOCK_VOUCHERS[0]);
      expect(mockVoucherService.findOne).toHaveBeenCalledWith('v1');
    });

    it('should propagate NotFoundException for unknown id', async () => {
      mockVoucherService.findOne.mockRejectedValue(
        new NotFoundException('Voucher not found'),
      );

      await expect(controller.findOne('nonexistent')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
