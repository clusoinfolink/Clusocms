'use client';

import React from 'react';
import Link from 'next/link';
import { GlassButton } from '@/components/ui/GlassButton';
import { Edit, Trash2 } from 'lucide-react';

export interface Column<T = Record<string, unknown>> {
  key: keyof T & string;
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface DataTableProps<T extends Record<string, unknown> = Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  editPath?: (row: T) => string;
  onDelete?: (id: string) => void;
  actions?: (row: T) => React.ReactNode;
  loading?: boolean;
}

export function DataTable<T extends Record<string, unknown>>({ columns, data, editPath, onDelete, actions, loading }: DataTableProps<T>) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {columns.map((col) => (
                <th key={col.key} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-400 text-sm">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-400 text-sm">
                  No items found.
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={(row._id as string) || i} className="hover:bg-gray-50/50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm text-gray-700">
                      {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {actions && actions(row)}
                      {editPath && (
                        <Link href={editPath(row)}>
                          <GlassButton variant="ghost" className="px-2 py-1.5">
                            <Edit size={14} />
                          </GlassButton>
                        </Link>
                      )}
                      {onDelete && (
                        <GlassButton
                          variant="danger"
                          className="px-2 py-1.5"
                          onClick={() => onDelete(row._id as string)}
                        >
                          <Trash2 size={14} />
                        </GlassButton>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
