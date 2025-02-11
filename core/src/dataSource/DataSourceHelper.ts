import {ColumnType, ITableDefinition, IColumnDefinition} from '../common'

export class DataSourceHelper {
  static getTableDefinitionFromObject(obj: any) {
    let table = {
      id: '',
      name: '',
      alias: '',
      useSourceCode: false,
      sourceCode: '',
      columns: [],
      connectorId: '',
      isFormula: false
    } as ITableDefinition

    for (let key in obj) {
      let col = {
        name: key,
        description: '',
        type: this.getColumnType(obj[key] as any)
      } as IColumnDefinition
      table.columns.push(col)
    }

    return table
  }

  static getColumnType(columnValue: any): ColumnType {
    if (typeof columnValue === 'number') {
      return ColumnType.Number
    }

    if (typeof columnValue === 'boolean') {
      return ColumnType.Boolean
    }

    if (columnValue instanceof Date) {
      return ColumnType.DateTime
    }

    return ColumnType.String
  }
}
