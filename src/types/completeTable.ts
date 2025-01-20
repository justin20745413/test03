import type { QTableColumn } from 'quasar'

export interface ITableColumn<
    Row extends Record<string, any> = any,
    Key = keyof Row extends string ? keyof Row : string,
    Field = Key | ((row: Row) => any)
> extends QTableColumn<Row, Key, Field> {
    width?: string
}
