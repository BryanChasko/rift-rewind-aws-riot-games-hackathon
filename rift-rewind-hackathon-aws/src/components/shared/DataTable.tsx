import React from 'react';
import { Table, Header, Box } from '@cloudscape-design/components';

export interface TableColumn<T> {
  id: string;
  header: string;
  cell: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  items: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  header?: string;
  description?: string;
  counter?: string;
  emptyMessage?: string;
  onSelectionChange?: (items: T[]) => void;
  selectedItems?: T[];
  selectionType?: 'single' | 'multi';
  trackBy?: string;
}

export function DataTable<T>({
  items,
  columns,
  loading = false,
  header,
  description,
  counter,
  emptyMessage = "No data available",
  onSelectionChange,
  selectedItems = [],
  selectionType,
  trackBy
}: DataTableProps<T>) {
  const columnDefinitions = columns.map(col => ({
    id: col.id,
    header: col.header,
    cell: col.cell
  }));

  return (
    <Table
      columnDefinitions={columnDefinitions}
      items={items}
      loading={loading}
      selectionType={selectionType}
      selectedItems={selectedItems}
      onSelectionChange={onSelectionChange ? ({ detail }) => onSelectionChange(detail.selectedItems) : undefined}
      trackBy={trackBy}
      header={header ? (
        <Header
          counter={counter}
          description={description}
        >
          {header}
        </Header>
      ) : undefined}
      empty={
        <Box textAlign="center">
          <Box variant="strong" textAlign="center">
            {emptyMessage}
          </Box>
        </Box>
      }
    />
  );
}