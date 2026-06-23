import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const request = require('supertest') as typeof import('supertest');
import { CountriesController } from '../countries.controller';
import { CountriesService } from '../countries.service';
import type { Server } from 'http';

interface Country {
  code: string;
  name: string;
}

const mockCountriesService = {
  findAll: jest.fn(),
};

describe('CountriesController', () => {
  let app: INestApplication;
  let server: Server;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountriesController],
      providers: [
        { provide: CountriesService, useValue: mockCountriesService },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    server = app.getHttpServer() as Server;

    jest.clearAllMocks();
  });

  afterEach(async () => {
    await app.close();
  });

  // Slice 1: GET /api/countries → 200 with a non-empty Country[], each item has code + name
  describe('GET /api/countries', () => {
    it('should return 200 with a non-empty array of countries each having code and name', async () => {
      const mockCountries: Country[] = [
        { code: 'GB', name: 'United Kingdom' },
        { code: 'FR', name: 'France' },
      ];
      mockCountriesService.findAll.mockReturnValue(mockCountries);

      const res = await request(server).get('/api/countries').expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      res.body.forEach((item: Country) => {
        expect(item).toHaveProperty('code');
        expect(item).toHaveProperty('name');
        expect(typeof item.code).toBe('string');
        expect(typeof item.name).toBe('string');
      });
      expect(mockCountriesService.findAll).toHaveBeenCalledTimes(1);
    });

    // Slice 2: list includes { code: "GB", name: "United Kingdom" }
    it('should include United Kingdom in the returned list', async () => {
      const mockCountries: Country[] = [
        { code: 'FR', name: 'France' },
        { code: 'GB', name: 'United Kingdom' },
        { code: 'DE', name: 'Germany' },
      ];
      mockCountriesService.findAll.mockReturnValue(mockCountries);

      const res = await request(server).get('/api/countries').expect(200);

      const uk = res.body.find((c: Country) => c.code === 'GB');
      expect(uk).toBeDefined();
      expect(uk.name).toBe('United Kingdom');
    });
  });
});
