import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class VoucherResponseDto {
  @Expose() id: string;
  @Expose() durationDays: number;
  @Expose() maxDevices: number;
  @Expose() priceGBP: number;

  constructor(partial: Partial<VoucherResponseDto>) {
    Object.assign(this, partial);
  }
}
