import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PurchaseService } from '../purchase.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePurchaseDto } from '../dto/create-purchase.dto';

const VALID_BILLING = {
  addressLine1: '10 High Street',
  city: 'London',
  county: 'Greater London',
  postCode: 'SW1A 1AA',
  country: 'United Kingdom',
};

const MOCK_VOUCHER = { id: 'voucher-1', durationDays: 7, priceGBP: 17.99 };

const MOCK_PURCHASE = {
  id: 'purchase-1',
  voucherId: 'voucher-1',
  qrCodeData: 'some-uuid',
  status: 'COMPLETED',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrismaService = {
  wifiVoucher: { findUnique: jest.fn() },
  purchase: { create: jest.fn() },
};

describe('PurchaseService', () => {
  let service: PurchaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PurchaseService>(PurchaseService);
    jest.clearAllMocks();
  });

  // Slice 1: createPurchase with valid dto returns PurchaseResponseDto with status COMPLETED
  describe('createPurchase()', () => {
    it('should create a purchase and return id, voucherId, qrCode, status COMPLETED', async () => {
      mockPrismaService.wifiVoucher.findUnique.mockResolvedValue(MOCK_VOUCHER);
      mockPrismaService.purchase.create.mockResolvedValue(MOCK_PURCHASE);

      const dto: CreatePurchaseDto = {
        voucherId: 'voucher-1',
        billingAddress: { ...VALID_BILLING },
      } as CreatePurchaseDto;

      const result = await service.createPurchase(dto);

      expect(result.id).toBe('purchase-1');
      expect(result.voucherId).toBe('voucher-1');
      expect(result.qrCode).toBe('some-uuid');
      expect(result.status).toBe('COMPLETED');
    });

    it('should call prisma.purchase.create with status COMPLETED and nested billingAddress', async () => {
      mockPrismaService.wifiVoucher.findUnique.mockResolvedValue(MOCK_VOUCHER);
      mockPrismaService.purchase.create.mockResolvedValue(MOCK_PURCHASE);

      const dto: CreatePurchaseDto = {
        voucherId: 'voucher-1',
        billingAddress: { ...VALID_BILLING },
      } as CreatePurchaseDto;

      await service.createPurchase(dto);

      const createCall = mockPrismaService.purchase.create.mock.calls[0][0];
      expect(createCall.data.status).toBe('COMPLETED');
      expect(createCall.data.voucherId).toBe('voucher-1');
      expect(createCall.data.billingAddress.create.addressLine1).toBe(
        '10 High Street',
      );
      expect(createCall.data.billingAddress.create.county).toBe(
        'Greater London',
      );
    });

    // Slice 3: Optional field — body without addressLine2 succeeds
    it('should succeed when addressLine2 is not provided', async () => {
      mockPrismaService.wifiVoucher.findUnique.mockResolvedValue(MOCK_VOUCHER);
      mockPrismaService.purchase.create.mockResolvedValue(MOCK_PURCHASE);

      const dto: CreatePurchaseDto = {
        voucherId: 'voucher-1',
        billingAddress: {
          addressLine1: '10 High Street',
          city: 'London',
          county: 'Greater London',
          postCode: 'SW1A 1AA',
          country: 'United Kingdom',
          // no addressLine2
        },
      } as CreatePurchaseDto;

      const result = await service.createPurchase(dto);

      expect(result.status).toBe('COMPLETED');
      expect(
        mockPrismaService.purchase.create.mock.calls[0][0].data.billingAddress
          .create.addressLine2,
      ).toBeUndefined();
    });

    // Slice 4: Unknown voucherId → 404 NotFoundException
    it('should throw NotFoundException when voucherId does not exist', async () => {
      mockPrismaService.wifiVoucher.findUnique.mockResolvedValue(null);

      const dto: CreatePurchaseDto = {
        voucherId: 'nonexistent',
        billingAddress: { ...VALID_BILLING },
      } as CreatePurchaseDto;

      await expect(service.createPurchase(dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockPrismaService.purchase.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException with message "Voucher not found"', async () => {
      mockPrismaService.wifiVoucher.findUnique.mockResolvedValue(null);

      const dto: CreatePurchaseDto = {
        voucherId: 'nonexistent',
        billingAddress: { ...VALID_BILLING },
      } as CreatePurchaseDto;

      await expect(service.createPurchase(dto)).rejects.toThrow(
        'Voucher not found',
      );
    });
  });
});
