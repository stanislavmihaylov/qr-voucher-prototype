import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BillingAddressDto } from './billing-address.dto';

export class CreatePurchaseDto {
  @IsString()
  @IsNotEmpty()
  voucherId: string;

  @ValidateNested()
  @Type(() => BillingAddressDto)
  billingAddress: BillingAddressDto;
}
