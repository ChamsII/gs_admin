import { Pipe, PipeTransform, ɵConsole } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {


  transform(items: any[], field: string, value: string): any[] {

    if (!items) {
        return [];
    }
    if (!field || !value) {
        return items;
    }
    
    return items.filter(function(el: any){
      return el[field].toLowerCase().includes(value.toLowerCase())
    });

  }

}
