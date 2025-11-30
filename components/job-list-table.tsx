"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
  Row,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { getJobAction, updateJobStatusAction } from "@/app/actions/job";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCirclePlusFilled,
  IconDotsVertical,
  IconEdit,
  IconHttpDelete,
  IconLoader,
  IconPlus,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { getColorForStatus, STATUS_DROPDOWN_OPTIONS } from "@/lib/constant";
import { showLoadingToast } from "@/lib/utils";
import Link from "next/link";
import Search from "./ui/search";
import { useDebounce } from "@/hooks/use-debounce";

// Define the shape of our data
interface Job {
  _id: string;
  customer: {
    name: string;
    phoneNumber: string;
  };
  deviceModel: string;
  problem: string;
  status: string;
  createdAt: string;
}

function ActionDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
          size="icon"
        >
          <IconDotsVertical />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function StatusDropdown({
  row,
  callBack,
}: {
  row: Row<Job>;
  callBack: () => void;
}) {
  const handleChangeStatus = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const status = e.currentTarget.textContent;
    if (status === row.original.status) return;

    const updateStatus = async () => {
      const res = await updateJobStatusAction(row.original._id, status);
      if (!res.result) {
        throw new Error("Failed to update status");
      }
      return res;
    };

    showLoadingToast(updateStatus(), () => {
      callBack();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge
          variant="outline"
          className={getColorForStatus(row.original.status)}
        >
          {row.original.status}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto">
        {STATUS_DROPDOWN_OPTIONS.map((option) => (
          <DropdownMenuItem key={option.value} onClick={handleChangeStatus}>
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const JobListTable = () => {
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

  const [search, setSearch] = React.useState<string>("");
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["jobs", pageIndex, pageSize, debouncedSearch],
    queryFn: () => getJobAction(pageIndex + 1, pageSize, debouncedSearch),
  });

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const columns: ColumnDef<Job>[] = React.useMemo(
    () => [
      {
        accessorKey: "customer.name",
        header: "Customer",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium">{row.original.customer?.name}</span>
            <span className="text-xs text-muted-foreground">
              {row.original.customer?.phoneNumber}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "deviceModel",
        header: "Device",
      },
      {
        accessorKey: "problem",
        header: "Problem",
      },
      {
        accessorKey: "estimatedPrice",
        header: "Estimated Price",
      },
      {
        accessorKey: "paidAmount",
        header: "Paid Amount",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusDropdown row={row} callBack={refetch} />,
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => {
          return new Date(row.original.createdAt).toLocaleDateString();
        },
      },
      {
        id: "actions",
        cell: () => <ActionDropdown />,
      },
    ],
    []
  );

  const defaultData = React.useMemo(() => [], []);

  const table = useReactTable({
    data: data?.result?.items ?? defaultData,
    columns,
    pageCount: data?.result?.pages ?? -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  if (isError) return <div>Error loading jobs</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <Search
          className="max-w-sm"
          placeholder="Search jobs..."
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link href="/app/job/new">
          <Button variant={"outline"} className="hidden md:flex">
            <IconCirclePlusFilled />
            Create Job
          </Button>
          <IconCirclePlusFilled className="flex md:hidden" />
        </Link>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <IconLoader className="animate-spin" /> Loading...
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.column.columnDef.cell
                        ? flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )
                        : 0}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {data?.result?.total ? `Total ${data.result.total} jobs` : ""}
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <IconChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <IconChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <IconChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <IconChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListTable;
