import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PurchaseResponseDto } from './dto/purchase-response.dto';

@Injectable()
export class PurchaseService {
  constructor(private readonly prisma: PrismaService) {}

  async createPurchase(dto: CreatePurchaseDto): Promise<PurchaseResponseDto> {
    const voucher = await this.prisma.wifiVoucher.findUnique({
      where: { id: dto.voucherId },
    });
    if (!voucher) {
      throw new NotFoundException('Voucher not found');
    }

    const qrCodeData = crypto.randomUUID();

    const purchase = await this.prisma.purchase.create({
      data: {
        voucherId: dto.voucherId,
        qrCodeData,
        status: 'COMPLETED',
        billingAddress: {
          create: {
            addressLine1: dto.billingAddress.addressLine1,
            addressLine2: dto.billingAddress.addressLine2,
            city: dto.billingAddress.city,
            county: dto.billingAddress.county,
            postCode: dto.billingAddress.postCode,
            country: dto.billingAddress.country,
          },
        },
      },
    });

    return new PurchaseResponseDto({
      id: purchase.id,
      voucherId: purchase.voucherId,
      qrCode: purchase.qrCodeData,
      status: purchase.status,
    });
  }
}
