import { Injectable } from '@nestjs/common';
import { COUNTRIES, Country } from './countries.data';

@Injectable()
export class CountriesService {
  findAll(): Country[] {
    return [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name));
  }
}
