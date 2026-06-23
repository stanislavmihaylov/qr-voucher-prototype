import { Test, TestingModule } from '@nestjs/testing';
import {
  ValidationPipe,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const request = require('supertest') as typeof import('supertest');
import { PurchaseController } from '../purchase.controller';
import { PurchaseService } from '../purchase.service';
import { CreatePurchaseDto } from '../dto/create-purchase.dto';
import type { Server } from 'http';

const VALID_BILLING = {
  addressLine1: '10 High Street',
  city: 'London',
  county: 'Greater London',
  postCode: 'SW1A 1AA',
  country: 'United Kingdom',
};

const MOCK_PURCHASE_RESPONSE = {
  id: 'purchase-1',
  voucherId: 'voucher-1',
  qrCode: 'some-uuid',
  voucherCode: '12345 - 67890',
  voucherName: '1-day voucher',
  status: 'COMPLETED',
};

const mockPurchaseService = {
  createPurchase: jest.fn(),
  findById: jest.fn(),
};

describe('PurchaseController', () => {
  let controller: PurchaseController;
  let app: INestApplication;
  let server: Server;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseController],
      providers: [{ provide: PurchaseService, useValue: mockPurchaseService }],
    }).compile();

    controller = module.get<PurchaseController>(PurchaseController);

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    server = app.getHttpServer() as Server;

    jest.clearAllMocks();
  });

  afterEach(async () => {
    await app.close();
  });

  // Slice 1: POST /api/purchases with valid body → 201, returns { id, voucherId, qrCode, status }
  describe('create()', () => {
    it('should return a purchase response with id, voucherId, qrCode, and status COMPLETED', async () => {
      mockPurchaseService.createPurchase.mockResolvedValue(
        MOCK_PURCHASE_RESPONSE,
      );

      const dto: CreatePurchaseDto = {
        voucherId: 'voucher-1',
        billingAddress: VALID_BILLING,
      };

      const result = await controller.create(dto);

      expect(result).toEqual(MOCK_PURCHASE_RESPONSE);
      expect(result.status).toBe('COMPLETED');
      expect(result.qrCode).toBeDefined();
      expect(mockPurchaseService.createPurchase).toHaveBeenCalledWith(dto);
    });

    it('should propagate NotFoundException when voucherId is unknown', async () => {
      mockPurchaseService.createPurchase.mockRejectedValue(
        new NotFoundException('Voucher not found'),
      );

      const dto: CreatePurchaseDto = {
        voucherId: 'nonexistent',
        billingAddress: VALID_BILLING,
      };

      await expect(controller.create(dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  // Slice 3 (qr-code feature): GET /api/purchases/:id returns full purchase DTO
  describe('findOne()', () => {
    it('should return qrCode, voucherCode, voucherName, and status for a known id', async () => {
      mockPurchaseService.findById.mockResolvedValue(MOCK_PURCHASE_RESPONSE);

      const response = await request(server)
        .get('/api/purchases/purchase-1')
        .expect(200);

      expect(response.body.id).toBe('purchase-1');
      expect(response.body.qrCode).toBe('some-uuid');
      expect(response.body.voucherCode).toBe('12345 - 67890');
      expect(response.body.voucherName).toBe('1-day voucher');
      expect(response.body.status).toBe('COMPLETED');
      expect(mockPurchaseService.findById).toHaveBeenCalledWith('purchase-1');
    });

    // Slice 4 (qr-code feature): GET /api/purchases/:id → 404 for unknown id
    it('should return 404 when purchase id is unknown', async () => {
      mockPurchaseService.findById.mockRejectedValue(
        new NotFoundException('Purchase not found'),
      );

      await request(server)
        .get('/api/purchases/nonexistent')
        .expect(404);
    });
  });

  // Slice 2: Validation — missing required billing fields → 400 from ValidationPipe
  describe('POST /api/purchases — validation', () => {
    it('should return 400 when addressLine1 is missing', async () => {
      await request(server)
        .post('/api/purchases')
        .send({
          voucherId: 'voucher-1',
          billingAddress: {
            city: 'London',
            county: 'Greater London',
            postCode: 'SW1A 1AA',
            country: 'United Kingdom',
          },
        })
        .expect(400);
      expect(mockPurchaseService.createPurchase).not.toHaveBeenCalled();
    });

    it('should return 400 when city is missing', async () => {
      await request(server)
        .post('/api/purchases')
        .send({
          voucherId: 'voucher-1',
          billingAddress: {
            addressLine1: '10 High Street',
            county: 'Greater London',
            postCode: 'SW1A 1AA',
            country: 'United Kingdom',
          },
        })
        .expect(400);
      expect(mockPurchaseService.createPurchase).not.toHaveBeenCalled();
    });

    it('should return 400 when county is missing', async () => {
      await request(server)
        .post('/api/purchases')
        .send({
          voucherId: 'voucher-1',
          billingAddress: {
            addressLine1: '10 High Street',
            city: 'London',
            postCode: 'SW1A 1AA',
            country: 'United Kingdom',
          },
        })
        .expect(400);
      expect(mockPurchaseService.createPurchase).not.toHaveBeenCalled();
    });

    it('should return 400 when postCode is missing', async () => {
      await request(server)
        .post('/api/purchases')
        .send({
          voucherId: 'voucher-1',
          billingAddress: {
            addressLine1: '10 High Street',
            city: 'London',
            county: 'Greater London',
            country: 'United Kingdom',
          },
        })
        .expect(400);
      expect(mockPurchaseService.createPurchase).not.toHaveBeenCalled();
    });

    it('should return 400 when country is missing', async () => {
      await request(server)
        .post('/api/purchases')
        .send({
          voucherId: 'voucher-1',
          billingAddress: {
            addressLine1: '10 High Street',
            city: 'London',
            county: 'Greater London',
            postCode: 'SW1A 1AA',
          },
        })
        .expect(400);
      expect(mockPurchaseService.createPurchase).not.toHaveBeenCalled();
    });

    it('should return 400 when voucherId is missing', async () => {
      await request(server)
        .post('/api/purchases')
        .send({ billingAddress: VALID_BILLING })
        .expect(400);
      expect(mockPurchaseService.createPurchase).not.toHaveBeenCalled();
    });

    // Slice 3: Optional field — body without addressLine2 succeeds (201)
    it('should return 201 when addressLine2 is omitted', async () => {
      mockPurchaseService.createPurchase.mockResolvedValue(
        MOCK_PURCHASE_RESPONSE,
      );
      await request(server)
        .post('/api/purchases')
        .send({
          voucherId: 'voucher-1',
          billingAddress: { ...VALID_BILLING },
        })
        .expect(201);
    });
  });
});
