import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({name:'money'})
export class MoneyFormat implements PipeTransform{
  transform (value: number, currencySymbol: string) : string{
    return currencySymbol + ' ' + new DecimalPipe('en').transform(value, '1.2-2');
  }
}