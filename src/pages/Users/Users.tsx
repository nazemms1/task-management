import type React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Avatar,
  Text,
  ActionIcon,
  Menu,
  Loader,
  Center,
  Stack,
} from "@mantine/core";
import {
  IconDownload,
  IconEdit,
  IconTrash,
  IconEye,
  IconPlus,
  IconUser,
  IconDots,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import type { RootState, AppDispatch } from "../../store/store";
import { fetchUsers, deleteUser } from "../../store/slices/usersSlice";
import { exportToExcel } from "../../utils/exportUtils";
import { ReusableTable } from "../../components/Table/ReusableTable";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  name?: string;
  email: string;
  avatar?: string;
  createdAt?: string;
}

const Users: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { users, loading, error } = useSelector(
    (state: RootState) => state.users
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const safeUsers: User[] = users || [];

  const filterUsers = () => {
    if (!searchTerm) return safeUsers;

    const term = searchTerm.toLowerCase();
    return safeUsers.filter(
      (user) =>
        user.first_name?.toLowerCase().includes(term) ||
        user.last_name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.id.toLowerCase().includes(term)
    );
  };

  const filteredUsers = filterUsers();
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleExportData = () => {
    const exportData = filteredUsers.map((user, index) => ({
      "Serial No": index + 1,
      "User ID": user.id,
      "First Name": user.first_name || "",
      "Last Name": user.last_name || "",
      "Email Address": user.email || "",
    }));

    exportToExcel(
      exportData,
      `users-export-${new Date().toISOString().split("T")[0]}`
    );

    notifications.show({
      title: "Export Successful",
      message: `${exportData.length} users exported to Excel`,
      color: "green",
    });
  };

  const handleUserDeletion = async (userId: string, userName: string) => {
    try {
      await dispatch(deleteUser(userId)).unwrap();
      notifications.show({
        title: "User Removed",
        message: `${userName} has been successfully deleted`,
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Deletion Failed",
        message: "Unable to delete user. Please try again.",
        color: "red",
      });
    }
  };

  const handleAddUser = () => {
    navigate("/users/add");
  };

  const handleEditUser = (userId: string) => {
    navigate(`/users/edit/${userId}`);
  };

  const renderActionMenu = (user: User) => (
    <Menu shadow="md" width="12.5rem" position="bottom-end">
      <Menu.Target>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="lg"
          style={{
            borderRadius: "0.5rem",
            transition: "all 0.2s ease",
          }}
          styles={{
            root: {
              "&:hover": {
                backgroundColor: "#f8f9fa",
              },
            },
          }}
        >
          <IconDots size="1rem" />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconEye size="0.875rem" />}
          styles={{
            item: {
              padding: "0.75rem 1rem",
              fontSize: "0.875rem",
            },
          }}
        >
          View
        </Menu.Item>
        <Menu.Item
          leftSection={<IconEdit size="0.875rem" />}
          onClick={() => handleEditUser(user.id)}
          styles={{
            item: {
              padding: "0.75rem 1rem",
              fontSize: "0.875rem",
            },
          }}
        >
          Edit
        </Menu.Item>
        <Menu.Item
          leftSection={<IconTrash size="0.875rem" />}
          color="red"
          onClick={() =>
            handleUserDeletion(user.id, `${user.first_name} ${user.last_name}`)
          }
          styles={{
            item: {
              padding: "0.75rem 1rem",
              fontSize: "0.875rem",
            },
          }}
        >
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );

  const userColumns = [
    {
      key: "id",
      label: "ID #",
      width: "5rem",
      render: (_: any, row: any, index: number) => (
        <Text size="0.875rem" fw={500}>
          {startIndex + index + 1}
        </Text>
      ),
    },
    {
      key: "avatar",
      label: "Image",
      width: "5rem",
      render: (_: any, row: User) => (
        <Avatar
          src={row.avatar}
          size="2.5rem"
          radius="50%"
          style={{
            border: "0.125rem solid #e9ecef",
          }}
        >
          <IconUser size="1.25rem" color="#2563eb" />
        </Avatar>
      ),
    },
    {
      key: "first_name",
      label: "First Name",
      width: "10rem",
      sortable: true,
      render: (value: string) => (
        <Text size="0.875rem" fw={500}>
          {value || "N/A"}
        </Text>
      ),
    },
    {
      key: "last_name",
      label: "Last Name",
      width: "10rem",
      sortable: true,
      render: (value: string) => (
        <Text size="0.875rem" fw={500}>
          {value || "N/A"}
        </Text>
      ),
    },
    {
      key: "email",
      label: "Email",
      width: "12rem",
      sortable: true,
      render: (value: string) => (
        <Text size="0.875rem" fw={500}>
          {value || "N/A"}
        </Text>
      ),
    },
    {
      key: "action",
      label: "Action",
      width: "5rem",
      render: (_: any, row: User) => renderActionMenu(row),
    },
  ];

  const tableControls = {
    search: {
      enabled: true,
      placeholder: "Search",
      value: searchTerm,
      onChange: setSearchTerm,
    },
    pagination: {
      enabled: true,
      current: currentPage,
      total: totalPages,
      pageSize: itemsPerPage,
      pageSizeOptions: ["10", "25", "50", "100"],
      onPageChange: setCurrentPage,
      onPageSizeChange: (value: string | null) => {
        if (value) {
          setItemsPerPage(parseInt(value));
          setCurrentPage(1);
        }
      },
    },
    actions: (
      <>
        <Button
          leftSection={<IconDownload size="1rem" />}
          variant="outline"
          onClick={handleExportData}
          disabled={filteredUsers.length === 0}
          style={{
            minWidth: "8rem",
            borderColor: "#2563eb",
            color: "#2563eb",
          }}
          styles={{
            root: {
              "&:hover": {
                backgroundColor: "#eff6ff",
              },
            },
          }}
        >
          Export
        </Button>
        <Button
          leftSection={<IconPlus size="1rem" />}
          onClick={handleAddUser}
          style={{
            backgroundColor: "#2563eb",
            minWidth: "8rem",
          }}
          styles={{
            root: {
              "&:hover": {
                backgroundColor: "#1d4ed8",
              },
            },
          }}
        >
          Add
        </Button>
      </>
    ),
  };

  const emptyState = {
    icon: <IconUser size="3rem" color="#ced4da" />,
    title: searchTerm ? "No matching users found" : "No users available",
    description: searchTerm
      ? "Try adjusting your search criteria"
      : "Users will appear here once they're added to the system",
  };

  if (loading) {
    return (
      <Container size="100%" p="1.5rem">
        <Center h="20rem">
          <Stack gap="1rem" align="center">
            <Loader size="xl" />
            <Text size="lg" c="dimmed">
              Loading users...
            </Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="100%" p="1.5rem">
        <Center h="20rem">
          <Stack gap="1rem" align="center">
            <Text size="xl" c="red" fw={600}>
              Unable to load users
            </Text>
            <Text size="md" c="dimmed" ta="center">
              {error}
            </Text>
            <Button onClick={() => dispatch(fetchUsers())} variant="light">
              Try Again
            </Button>
          </Stack>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="100%" p="1.5rem" style={{ minHeight: "100vh" }}>
      <ReusableTable
        columns={userColumns}
        data={paginatedUsers}
        highlightOnHover
        controls={tableControls}
        emptyState={emptyState}
        containerStyle={{
          backgroundColor: "white",
        }}
      />
    </Container>
  );
};

export default Users;
