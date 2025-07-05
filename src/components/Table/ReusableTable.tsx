import React from "react";
import {
  Table,
  Box,
  Text,
  Center,
  Stack,
  Group,
  Select,
  TextInput,
  Pagination,
} from "@mantine/core";
import { IconSearch, IconUser } from "@tabler/icons-react";

interface TableColumn {
  key: string;
  label: string;
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  render?: (value: never, row: never, index: number) => React.ReactNode;
}

interface TableControlsConfig {
  search?: {
    enabled: boolean;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
  };
  pagination?: {
    enabled: boolean;
    current: number;
    total: number;
    pageSize: number;
    pageSizeOptions?: string[];
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: string | null) => void;
  };
  actions?: React.ReactNode;
}

interface ReusableTableProps {
  columns: TableColumn[];
  data: unknown[];
  loading?: boolean;
  striped?: boolean;
  highlightOnHover?: boolean;
  controls?: TableControlsConfig;
  emptyState?: {
    icon?: React.ReactNode;
    title: string;
    description?: string;
  };
  containerStyle?: React.CSSProperties;
  tableStyle?: React.CSSProperties;
}

export const ReusableTable: React.FC<ReusableTableProps> = ({
  columns,
  data,
  striped = false,
  highlightOnHover = true,
  controls,
  emptyState,
  containerStyle,
  tableStyle,
}) => {
  const renderControls = () => {
    if (!controls) return null;

    const { search, pagination, actions } = controls;

    return (
      <Group justify="space-between" mb="1.5rem">
        <Group gap="0.75rem">
          {pagination?.enabled && pagination.onPageSizeChange && (
            <Group gap="0.5rem" align="center">
              <Text size="0.875rem" c="#666">
                Show
              </Text>
              <Select
                value={pagination.pageSize.toString()}
                onChange={pagination.onPageSizeChange}
                data={pagination.pageSizeOptions || ["10", "25", "50", "100"]}
                w="5rem"
                size="sm"
                styles={{
                  input: {
                    borderColor: "#e0e0e0",
                    boxShadow: "none",
                    "&:focus": {
                      borderColor: "#4A90E2",
                    },
                  },
                }}
              />
              <Text size="0.875rem" c="#666">
                Row
              </Text>
            </Group>
          )}
        </Group>

        <Group gap="0.75rem">
          {actions}
          {search?.enabled && (
            <TextInput
              placeholder={search.placeholder || "Search..."}
              leftSection={<IconSearch size="1rem" />}
              value={search.value}
              onChange={(e) => search.onChange(e.currentTarget.value)}
              w="18.75rem"
              size="sm"
              styles={{
                input: {
                  borderColor: "#e0e0e0",
                  boxShadow: "none",
                  "&:focus": {
                    borderColor: "#4A90E2",
                    boxShadow: "0 0 0 0.125rem rgba(74, 144, 226, 0.2)",
                  },
                },
              }}
            />
          )}
        </Group>
      </Group>
    );
  };

  const renderPagination = () => {
    if (!controls?.pagination?.enabled) return null;

    const { pagination } = controls;
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = Math.min(startIndex + pagination.pageSize, data.length);

    return (
      <Group justify="space-between" align="center" mt="1.5rem">
        <Text size="0.875rem" c="dimmed">
          Shows {data.length > 0 ? startIndex + 1 : 0} to {endIndex} of{" "}
          {data.length} entries
        </Text>

        <Pagination
          total={pagination.total}
          value={pagination.current}
          onChange={pagination.onPageChange}
          size="sm"
          siblings={1}
          boundaries={1}
          styles={{
            control: {
              "&[data-active]": {
                backgroundColor: "#2563eb",
                borderColor: "#2563eb",
              },
            },
          }}
        />
      </Group>
    );
  };

  const renderEmptyState = () => {
    if (!emptyState) return null;

    return (
      <Center style={{ padding: "3rem 1.25rem" }}>
        <Stack gap="0.5rem" align="center">
          {emptyState.icon || <IconUser size="3rem" color="#ced4da" />}
          <Text size="lg" fw={500} c="dimmed">
            {emptyState.title}
          </Text>
          {emptyState.description && (
            <Text size="sm" c="dimmed" ta="center">
              {emptyState.description}
            </Text>
          )}
        </Stack>
      </Center>
    );
  };

  return (
    <Stack gap="0">
      {renderControls()}

      <Box
        style={{
          backgroundColor: "white",
          overflow: "hidden",
          ...containerStyle,
        }}
      >
        <Table
          striped={striped}
          highlightOnHover={highlightOnHover}
          style={{
            fontSize: "0.875rem",
            ...tableStyle,
          }}
        >
          <Table.Thead>
            <Table.Tr style={{}}>
              {columns.map((column) => (
                <Table.Th
                  key={column.key}
                  style={{
                    padding: "1rem 1.25rem",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: "#495057",
                    width: column.width,
                    textAlign: column.align || "left",
                  }}
                >
                  {column.label}
                  {column.sortable && " ⬇"}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <Table.Tr key={row.id || rowIndex}>
                  {columns.map((column) => (
                    <Table.Td
                      key={`${rowIndex}-${column.key}`}
                      style={{
                        padding: "1rem 1.25rem",
                        textAlign: column.align || "left",
                      }}
                    >
                      {column.render
                        ? column.render(row[column.key], row, rowIndex)
                        : row[column.key] || "N/A"}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={columns.length}>
                  {renderEmptyState()}
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Box>

      {renderPagination()}
    </Stack>
  );
};
