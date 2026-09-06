'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { Checkbox } from './checkbox';
import { Input } from './input';
import { Button } from './button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Filter, RefreshCw, Eye, EyeOff, X, LayoutGrid, Table as TableIcon } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/use-debounce';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  searchable?: boolean;
  searchablePlaceholder?: string;
  filterable?: boolean;
  filterOptions?: { value: string; label: string }[];
  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  onSearch?: (value: string) => void;
  onFilter?: (value: string) => void;
  onSort?: (sorting: SortingState) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onRefresh?: () => void;
  totalCount?: number;
  currentPage?: number;
  showColumnToggle?: boolean;
  showViewToggle?: boolean;
  selectable?: boolean;
  selectedIds?: number[];
  onSelectionChange?: (selectedIds: number[]) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  searchable = true,
  searchablePlaceholder = 'Rechercher...',
  filterable = false,
  filterOptions = [],
  pagination = true,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 25, 30, 50, 100],
  onSearch,
  onFilter,
  onSort,
  onPageChange,
  onPageSizeChange,
  onRefresh,
  totalCount,
  currentPage = 1,
  showColumnToggle = true,
  showViewToggle = false,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [search, setSearch] = React.useState('');
  const [searchActive, setSearchActive] = React.useState(false);
  const [filter, setFilter] = React.useState('');
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [showColumnMenu, setShowColumnMenu] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'table' | 'card'>('table');
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [globalFilter, setGlobalFilter] = React.useState('');

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(search, 300);

  // Update global filter when search changes
  React.useEffect(() => {
    setGlobalFilter(debouncedSearch);
  }, [debouncedSearch]);

  // Trigger search when debounced value changes
  React.useEffect(() => {
    onSearch?.(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  // Add selection column if selectable
  const columnsWithSelection = React.useMemo(() => {
    if (!selectable) return columns;
    return [
      {
        id: 'select',
        header: ({ table }: any) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }: any) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      ...columns,
    ];
  }, [selectable, columns]);

  const table = useReactTable({
    data,
    columns: columnsWithSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(newSorting);
      onSort?.(newSorting);
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    manualPagination: false,
    manualFiltering: false,
    pageCount: -1,
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setSearchActive(value !== '');
    // If no onSearch callback, use client-side filtering
    if (!onSearch) {
      setGlobalFilter(value);
    }
  };

  // Update parent with selected IDs
  React.useEffect(() => {
    if (selectable && onSelectionChange) {
      const selectedRowIds = Object.keys(rowSelection).filter(key => rowSelection[key]);
      const selectedIds = selectedRowIds.map(key => {
        const index = parseInt(key);
        const row = data[index];
        return (row as any).id;
      }).filter(id => id !== undefined);
      onSelectionChange(selectedIds);
    }
  }, [rowSelection, data, selectable, onSelectionChange]);

  const handleFilter = (value: string) => {
    setFilter(value);
    onFilter?.(value);
  };

  const handlePageSizeChange = (newPageSize: string) => {
    if (newPageSize === 'all') {
      table.setPageSize(data.length);
      onPageSizeChange?.(data.length);
    } else {
      const size = parseInt(newPageSize);
      table.setPageSize(size);
      onPageSizeChange?.(size);
    }
  };

  const toggleColumnVisibility = (columnId: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnId]: !prev[columnId]
    }));
  };

  const totalPages = totalCount ? Math.ceil(totalCount / pageSize) : table.getPageCount();

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {searchable && (
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder={searchablePlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(search);
                  }
                }}
                className="pl-9 pr-10 h-10"
              />
              {searchActive ? (
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => {
                    setSearch('');
                    setSearchActive(false);
                    handleSearch('');
                  }}
                >
                  <X className="size-4" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => handleSearch(search)}
                >
                  <Search className="size-4" />
                </Button>
              )}
            </div>
          )}
          {filterable && filterOptions.length > 0 && (
            <>
              {filter ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFilter('')}
                  className="gap-2"
                >
                  <X className="size-4" />
                  Réinitialiser
                </Button>
              ) : (
                <>
                  {filterOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant="outline"
                      size="sm"
                      onClick={() => handleFilter(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="size-4" />
                    Filtres
                  </Button>
                </>
              )}
            </>
          )}
        </div>
        
        <div className="flex gap-2 items-center">
          {/* Page size selector */}
          {pagination && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Afficher</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => handlePageSizeChange(e.target.value)}
                className="h-8 w-16 rounded border border-input bg-background px-2 text-sm"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
                <option value="all">Tout</option>
              </select>
            </div>
          )}
          
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh} className="gap-2">
              <RefreshCw className="size-4" />
              Actualiser
            </Button>
          )}
          {showViewToggle && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
              className="gap-2"
            >
              {viewMode === 'table' ? (
                <>
                  <LayoutGrid className="size-4" />
                  Cards
                </>
              ) : (
                <>
                  <TableIcon className="size-4" />
                  Table
                </>
              )}
            </Button>
          )}
          {showColumnToggle && (
            <div className="relative">
              <Button variant="outline" size="sm" onClick={() => setShowColumnMenu(!showColumnMenu)} className="gap-2">
                <Eye className="size-4" />
                Colonnes
              </Button>
              {showColumnMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10 p-2">
                  {table.getAllColumns().map((column) => (
                    <label key={column.id} className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={column.getIsVisible()}
                        onChange={() => column.toggleVisibility()}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">{column.id}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Table or Card View */}
      {viewMode === 'table' ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : (
                          <div
                            className={
                              header.column.getCanSort()
                                ? 'cursor-pointer select-none flex items-center gap-2'
                                : ''
                            }
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <span className="ml-2">↑</span>,
                              desc: <span className="ml-2">↓</span>,
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row: any) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell: any) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Aucun résultat trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row: any) => (
              <div key={row.id} className="rounded-md border p-4 bg-card hover:shadow-md transition-shadow">
                {row.getVisibleCells().map((cell: any) => (
                  <div key={cell.id} className="mb-2 last:mb-0">
                    <div className="text-xs text-muted-foreground mb-1">
                      {cell.column.columnDef.header as string}
                    </div>
                    <div>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : loading ? (
            <div className="col-span-full h-24 text-center text-muted-foreground">
              Chargement...
            </div>
          ) : (
            <div className="col-span-full h-24 text-center text-muted-foreground">
              Aucun résultat trouvé.
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            {totalCount ? (
              <>
                Affichage de {(currentPage - 1) * pageSize + 1} à{' '}
                {Math.min(currentPage * pageSize, totalCount)} sur {totalCount} résultats
                {Math.ceil(totalCount / pageSize) > 1 && (
                  <span className="ml-2">
                    (Page {currentPage} sur {Math.ceil(totalCount / pageSize)})
                  </span>
                )}
              </>
            ) : (
              <>
                Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}
              </>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => {
                onPageChange?.(currentPage - 1);
              }}
              disabled={currentPage <= 1}
            >
              <span className="sr-only">Page précédente</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(Math.ceil((totalCount || 0) / pageSize), 7) }, (_, i) => {
                const totalPages = Math.ceil((totalCount || 0) / pageSize);
                let pageNum;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (currentPage <= 4) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = currentPage - 3 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      onPageChange?.(pageNum);
                    }}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => {
                onPageChange?.(currentPage + 1);
              }}
              disabled={currentPage >= Math.ceil((totalCount || 0) / pageSize)}
            >
              <span className="sr-only">Page suivante</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
