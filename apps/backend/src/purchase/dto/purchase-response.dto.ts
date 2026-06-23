import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PurchaseResponseDto {
  @Expose() id: string;
  @Expose() voucherId: string;
  @Expose() qrCode: string;
  @Expose() status: string;

  constructor(partial: Partial<PurchaseResponseDto>) {
    Object.assign(this, partial);
  }
}
