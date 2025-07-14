import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

export interface Column<T> {
  key: keyof T;
  header: string;
  className?: string;
  headerClassName?: string;
  render?: (value: T[keyof T], item: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  rowClassName?: (item: T, index: number) => string;
  getRowKey?: (item: T, index: number) => string | number;
}

export function DataTable<T>({
  data,
  columns,
  className,
  rowClassName,
  getRowKey,
}: DataTableProps<T>) {
  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={String(column.key)}
              className={column.headerClassName}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow
            key={getRowKey ? getRowKey(item, index) : index}
            className={rowClassName ? rowClassName(item, index) : ""}
          >
            {columns.map((column) => (
              <TableCell key={String(column.key)} className={column.className}>
                {column.render
                  ? column.render(item[column.key], item, index)
                  : String(item[column.key])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
