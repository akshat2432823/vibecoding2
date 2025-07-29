import { Plus, Edit, Trash2 } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?: (value: any, item: any) => React.ReactNode;
}

interface DataTableProps {
  title: string;
  data: any[];
  columns: Column[];
  loading?: boolean;
  onNew: () => void;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
}

export default function DataTable({ 
  title, 
  data, 
  columns, 
  loading = false, 
  onNew, 
  onEdit, 
  onDelete 
}: DataTableProps) {
  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="page-title">{title}</h1>
            <p className="page-subtitle">Manage {title.toLowerCase()}</p>
          </div>
          <button
            onClick={onNew}
            className="cognizant-button-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New
          </button>
        </div>
      </div>

      <div className="cognizant-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-500">Loading data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="cognizant-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.key} className="cognizant-table-th">
                      {column.label}
                    </th>
                  ))}
                  <th className="cognizant-table-th text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length + 1}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Plus className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-lg font-medium text-gray-900 mb-2">No records found</p>
                        <p className="text-gray-500">Get started by creating your first record.</p>
                        <button
                          onClick={onNew}
                          className="mt-4 cognizant-button-primary"
                        >
                          Add First Record
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-gray-50 transition-colors duration-150">
                      {columns.map((column) => (
                        <td key={column.key} className="cognizant-table-td">
                          {column.render 
                            ? column.render(item[column.key], item)
                            : item[column.key] || '-'
                          }
                        </td>
                      ))}
                      <td className="cognizant-table-td text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => onEdit(item)}
                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors duration-150"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onDelete(item)}
                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors duration-150"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 