import { Controller, Get, Param } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherResponseDto } from './dto/voucher-response.dto';

@Controller('api/vouchers')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Get()
  findAll(): Promise<VoucherResponseDto[]> {
    return this.voucherService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<VoucherResponseDto> {
    return this.voucherService.findOne(id);
  }
}
