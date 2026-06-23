import { Controller, Get } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { Country } from './countries.data';

@Controller('api/countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  findAll(): Country[] {
    return this.countriesService.findAll();
  }
}
