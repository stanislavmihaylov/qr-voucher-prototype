import { randomInt } from 'node:crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PurchaseResponseDto } from './dto/purchase-response.dto';

@Injectable()
export class PurchaseService {
  constructor(private readonly prisma: PrismaService) {}

  private generateVoucherCode(): string {
    const pad = (n: number) => String(n).padStart(5, '0');
    const a = pad(randomInt(100000));
    const b = pad(randomInt(100000));
    return `${a} - ${b}`;
  }

  async createPurchase(dto: CreatePurchaseDto): Promise<PurchaseResponseDto> {
    const voucher = await this.prisma.wifiVoucher.findUnique({
      where: { id: dto.voucherId },
    });
    if (!voucher) {
      throw new NotFoundException('Voucher not found');
    }

    const qrCodeData = crypto.randomUUID();
    const voucherCode = this.generateVoucherCode();

    const purchase = await this.prisma.purchase.create({
      data: {
        voucherId: dto.voucherId,
        qrCodeData,
        voucherCode,
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
      voucherCode: purchase.voucherCode,
      voucherName: voucher.name,
      status: purchase.status,
    });
  }

  async findById(id: string): Promise<PurchaseResponseDto> {
    const purchase = await this.prisma.purchase.findUnique({
      where: { id },
      include: { voucher: true },
    });
    if (!purchase) {
      throw new NotFoundException('Purchase not found');
    }
    return new PurchaseResponseDto({
      id: purchase.id,
      voucherId: purchase.voucherId,
      qrCode: purchase.qrCodeData,
      voucherCode: purchase.voucherCode,
      voucherName: purchase.voucher.name,
      status: purchase.status,
    });
  }
}
