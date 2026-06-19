import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VoucherResponseDto } from './dto/voucher-response.dto';

@Injectable()
export class VoucherService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<VoucherResponseDto[]> {
    const vouchers = await this.prisma.wifiVoucher.findMany({
      orderBy: { durationDays: 'asc' },
    });
    return vouchers.map(
      (v) =>
        new VoucherResponseDto({
          id: v.id,
          durationDays: v.durationDays,
          maxDevices: v.maxDevices,
          priceGBP: Number(v.priceGBP),
        }),
    );
  }

  async findOne(id: string): Promise<VoucherResponseDto> {
    const voucher = await this.prisma.wifiVoucher.findUnique({ where: { id } });
    if (!voucher) {
      throw new NotFoundException('Voucher not found');
    }
    return new VoucherResponseDto({
      id: voucher.id,
      durationDays: voucher.durationDays,
      maxDevices: voucher.maxDevices,
      priceGBP: Number(voucher.priceGBP),
    });
  }
}
