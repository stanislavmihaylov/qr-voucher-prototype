import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PurchaseResponseDto } from './dto/purchase-response.dto';

@Controller('api/purchases')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreatePurchaseDto): Promise<PurchaseResponseDto> {
    return this.purchaseService.createPurchase(dto);
  }
}
