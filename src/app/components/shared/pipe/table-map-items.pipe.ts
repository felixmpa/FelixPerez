import { Pipe, PipeTransform } from '@angular/core';
import { STableColumnsProps, STableRowProps } from '../table/table.component';

@Pipe({
  name: 'mapItemsToRowsProps',
  standalone: true
})
export class MapItemsToRowsPropsPipe implements PipeTransform {
  transform<T>(items: T[], columns: STableColumnsProps[]): STableRowProps[] {
    return items.map(item => {
      const row: STableRowProps = {};
      columns.forEach(column => {
        row[column.field] = (item as any)[column.field];
      });
      return row;
    });
  }
}
