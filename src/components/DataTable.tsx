import type { ReactNode } from "react";

type DataTableColumn<T> = {
  key: string;
  header: ReactNode;
  render: (item: T) => ReactNode;
};

type DataTableProps<T> = {
  items: T[];
  columns: DataTableColumn<T>[];
  getRowKey: (item: T) => string | number;
};

function DataTable<T>({ items, columns, getRowKey }: DataTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {items.map((item) => (
            <tr
              key={getRowKey(item)}
              className="transition-colors hover:bg-gray-50"
            >
              {columns.map((column) => (
                <td key={column.key} className="px-5 py-4">
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
