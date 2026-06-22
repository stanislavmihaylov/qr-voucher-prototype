import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe, INestApplication, NotFoundException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const request = require('supertest') as typeof import('supertest');
import { PurchaseController } from '../purchase.controller';
import { PurchaseService } from '../purchase.service';
import { CreatePurchaseDto } from '../dto/create-purchase.dto';

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
  status: 'COMPLETED',
};

const mockPurchaseService = {
  createPurchase: jest.fn(),
};

describe('PurchaseController', () => {
  let controller: PurchaseController;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseController],
      providers: [{ provide: PurchaseService, useValue: mockPurchaseService }],
    }).compile();

    controller = module.get<PurchaseController>(PurchaseController);

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();

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
      } as CreatePurchaseDto;

      const result = await controller.create(dto);

      expect(result).toEqual(MOCK_PURCHASE_RESPONSE);
      expect(result.status).toBe('COMPLETED');
      expect(result.qrCode).toBeDefined();
      expect(mockPurchaseService.createPurchase).toHaveBeenCalledWith(dto);
    });

    // Slice 2: Validation — missing required fields do not reach the service (ValidationPipe handles this at the framework level)
    // We test that the service is NOT called when the service throws (integration behaviour).
    // For unit tests, we verify the controller passes through whatever the service returns/throws.
    it('should propagate NotFoundException when voucherId is unknown', async () => {
      mockPurchaseService.createPurchase.mockRejectedValue(
        new NotFoundException('Voucher not found'),
      );

      const dto: CreatePurchaseDto = {
        voucherId: 'nonexistent',
        billingAddress: VALID_BILLING,
      } as CreatePurchaseDto;

      await expect(controller.create(dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  // Slice 2: Validation — missing required billing fields → 400 from ValidationPipe
  describe('POST /api/purchases — validation', () => {
    it('should return 400 when addressLine1 is missing', async () => {
      const { addressLine1: _removed, ...billingWithoutLine1 } = VALID_BILLING;
      await request(app.getHttpServer())
        .post('/api/purchases')
        .send({ voucherId: 'voucher-1', billingAddress: billingWithoutLine1 })
        .expect(400);
      expect(mockPurchaseService.createPurchase).not.toHaveBeenCalled();
    });

    it('should return 400 when city is missing', async () => {
      const { city: _removed, ...billingWithoutCity } = VALID_BILLING;
      await request(app.getHttpServer())
        .post('/api/purchases')
        .send({ voucherId: 'voucher-1', billingAddress: billingWithoutCity })
        .expect(400);
      expect(mockPurchaseService.createPurchase).not.toHaveBeenCalled();
    });

    it('should return 400 when county is missing', async () => {
      const { county: _removed, ...billingWithoutCounty } = VALID_BILLING;
      await request(app.getHttpServer())
        .post('/api/purchases')
        .send({ voucherId: 'voucher-1', billingAddress: billingWithoutCounty })
        .expect(400);
      expect(mockPurchaseService.createPurchase).not.toHaveBeenCalled();
    });

    it('should return 400 when postCode is missing', async () => {
      const { postCode: _removed, ...billingWithoutPostCode } = VALID_BILLING;
      await request(app.getHttpServer())
        .post('/api/purchases')
        .send({ voucherId: 'voucher-1', billingAddress: billingWithoutPostCode })
        .expect(400);
      expect(mockPurchaseService.createPurchase).not.toHaveBeenCalled();
    });

    it('should return 400 when country is missing', async () => {
      const { country: _removed, ...billingWithoutCountry } = VALID_BILLING;
      await request(app.getHttpServer())
        .post('/api/purchases')
        .send({ voucherId: 'voucher-1', billingAddress: billingWithoutCountry })
        .expect(400);
      expect(mockPurchaseService.createPurchase).not.toHaveBeenCalled();
    });

    it('should return 400 when voucherId is missing', async () => {
      await request(app.getHttpServer())
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
      const { addressLine2: _removed, ...billingWithoutLine2 } = {
        ...VALID_BILLING,
        addressLine2: 'Flat 1',
      };
      await request(app.getHttpServer())
        .post('/api/purchases')
        .send({ voucherId: 'voucher-1', billingAddress: billingWithoutLine2 })
        .expect(201);
    });
  });
});
