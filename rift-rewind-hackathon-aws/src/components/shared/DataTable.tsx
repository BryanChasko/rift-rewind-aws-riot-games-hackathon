import React from 'react';
import { Table, Header, Box } from '@cloudscape-design/components';
import { announceToScreenReader } from '../../utils/accessibility';
import { useResponsive } from '../../utils/responsive';

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
  const { isMobile } = useResponsive();
  React.useEffect(() => {
    if (!loading && items.length > 0) {
      announceToScreenReader(
        `Table updated: ${items.length} ${items.length === 1 ? 'item' : 'items'} available`,
        'polite'
      );
    } else if (!loading && items.length === 0) {
      announceToScreenReader('Table is empty', 'polite');
    }
  }, [loading, items.length]);
  const columnDefinitions = columns.map(col => ({
    id: col.id,
    header: col.header,
    cell: col.cell
  }));

  return (
    <div className="responsive-table">
    <Table
      variant={isMobile ? 'borderless' : 'container'}
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
        <Box textAlign="center"  aria-live="polite">
          <Box variant="strong" textAlign="center">
            {emptyMessage}
          </Box>
        </Box>
      }
      ariaLabels={{
        tableLabel: header || 'Data table',
        selectionGroupLabel: 'Item selection',
        itemSelectionLabel: ({ selectedItems }, item) => {
          const isSelected = selectedItems.indexOf(item) >= 0;
          return `${isSelected ? 'Selected' : 'Not selected'} item`;
        },
        allItemsSelectionLabel: ({ selectedItems }) => 
          `${selectedItems.length} of ${items.length} items selected`,
        resizerRoleDescription: 'Column resizer'
      }}
    />
    </div>
  );
}