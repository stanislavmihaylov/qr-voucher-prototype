import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { VoucherModule } from './voucher/voucher.module';
import { PurchaseModule } from './purchase/purchase.module';
import { CountriesModule } from './countries/countries.module';

@Module({
  imports: [PrismaModule, VoucherModule, PurchaseModule, CountriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
