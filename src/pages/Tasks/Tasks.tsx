/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Group,
  Button,
  Text,
  Badge,
  Avatar,
  Box,
  ActionIcon,
  Menu,
  SimpleGrid,
} from "@mantine/core";
import {
  IconDots,
  IconPlus,
  IconEdit,
  IconTrash,
  IconTable,
  IconLayoutGrid,
  IconUser,
  IconEye,
  IconCheck,
  IconDownload,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import type { RootState, AppDispatch } from "../../store/store";
import {
  fetchTasks,
  deleteTask,
  updateTask,
} from "../../store/slices/tasksSlice";
import { fetchUsers } from "../../store/slices/usersSlice";
import { ReusableTable } from "../../components/Table/ReusableTable";
import { TaskCard } from "../../components/Tasks/TaskCard";
import { exportToExcel } from "../../utils/exportUtils";

type ViewMode = "table" | "cards";

const Tasks: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);
  const { users } = useSelector((state: RootState) => state.users);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchUsers());
  }, [dispatch]);

  const safeTasks = tasks || [];
  const safeUsers = users || [];

  const filteredTasks = safeTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  const getUserById = (id: string) => safeUsers.find((user) => user.id === id);

  const formatDate = (date: string) => {
    if (!date) return "N/A";
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "Invalid Date";
    return dateObj.toLocaleDateString("en-GB").replace(/\//g, "-");
  };

  const getTaskDate = (task: any, dateType: "start" | "end") => {
    if (dateType === "start") {
      return task.startDate || task.start_date || "";
    } else {
      return task.endDate || task.end_date || "";
    }
  };

  const getUserDisplayName = (task: any) => {
    const assignedUser = getUserById(task.assignedUserId);
    return (
      task.user_name ||
      task.userName ||
      assignedUser?.name ||
      `${assignedUser?.first_name || ""} ${
        assignedUser?.last_name || ""
      }`.trim() ||
      `${assignedUser?.firstName || ""} ${
        assignedUser?.lastName || ""
      }`.trim() ||
      "Unknown User"
    );
  };

  const getTaskStatus = (task: any) => {
    return task.completed || task.is_completed || task.isCompleted || false;
  };

  const getUserAvatar = (task: any) => {
    const assignedUser = getUserById(task.assignedUserId);
    return task.user_avatar || task.userAvatar || assignedUser?.avatar;
  };

  const handleExportData = () => {
    const exportData = filteredTasks.map((task, index) => ({
      "Serial No": index + 1,
      "Task ID": task.id,
      Title: task.title || "",
      Description: task.description || "",
      "Assigned User": getUserDisplayName(task),
      "Start Date": formatDate(getTaskDate(task, "start")),
      "End Date": formatDate(getTaskDate(task, "end")),
      Status: getTaskStatus(task) ? "Completed" : "Not Completed",
      Priority: task.priority || "Normal",
      "Created Date": task.createdAt
        ? formatDate(task.createdAt)
        : task.created_at
        ? formatDate(task.created_at)
        : "N/A",
      "Updated Date": task.updatedAt
        ? formatDate(task.updatedAt)
        : task.updated_at
        ? formatDate(task.updated_at)
        : "N/A",
    }));

    exportToExcel(
      exportData,
      `tasks-export-${new Date().toISOString().split("T")[0]}`
    );

    notifications.show({
      title: "Export Successful",
      message: `${exportData.length} tasks exported to Excel`,
      color: "green",
    });
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await dispatch(deleteTask(id)).unwrap();
      notifications.show({
        title: "Success",
        message: "Task deleted successfully",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to delete task",
        color: "red",
      });
    }
  };

  const handleToggleTaskCompletion = async (
    taskId: string,
    currentStatus: boolean
  ) => {
    try {
      const currentTask = safeTasks.find((task) => task.id === taskId);
      if (!currentTask) return;

      const updatedTask = {
        ...currentTask,
        completed: !currentStatus,
        is_completed: !currentStatus,
        isCompleted: !currentStatus,
      };

      await dispatch(updateTask(updatedTask)).unwrap();

      notifications.show({
        title: "Success",
        message: `Task marked as ${!currentStatus ? "completed" : "pending"}`,
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update task status",
        color: "red",
      });
    }
  };

  const handleViewTask = (taskId: string) => {
    console.log(`Viewing task: ${taskId}`);
  };

  const handleNavigation = {
    addTask: () => navigate("/tasks/add"),
    editTask: (taskId: string) => navigate(`/tasks/edit/${taskId}`),
  };

  const renderTaskActions = (task: any) => (
    <Menu shadow="md" width="12.5rem">
      <Menu.Target>
        <ActionIcon variant="subtle" color="gray" size="sm">
          <IconDots size="1rem" />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconEye size="0.875rem" />}
          onClick={() => handleViewTask(task.id)}
        >
          View
        </Menu.Item>
        <Menu.Item
          leftSection={<IconEdit size="0.875rem" />}
          onClick={() => handleNavigation.editTask(task.id)}
        >
          Edit
        </Menu.Item>
        <Menu.Item
          leftSection={<IconTrash size="0.875rem" />}
          color="red"
          onClick={() => handleDeleteTask(task.id)}
        >
          Delete
        </Menu.Item>
        <Menu.Item
          leftSection={<IconCheck size="0.875rem" />}
          color={getTaskStatus(task) ? "orange" : "green"}
          onClick={() =>
            handleToggleTaskCompletion(task.id, getTaskStatus(task))
          }
        >
          {getTaskStatus(task) ? "Mark As Pending" : "Mark As Completed"}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );

  const tableColumns = [
    {
      key: "id",
      label: "ID #",
      width: "5rem",
      render: (_: any, row: any, index: number) => (
        <Text fw={500} size="sm">
          {(currentPage - 1) * itemsPerPage + index + 1}
        </Text>
      ),
    },
    {
      key: "title",
      label: "Title ",
      width: "12rem",
      sortable: true,
      render: (value: string) => (
        <Text size="sm" fw={500} lineClamp={2}>
          {value}
        </Text>
      ),
    },
    {
      key: "image",
      label: "Image",
      width: "5rem",
      render: (_: any, row: any) => (
        <Avatar
          src={getUserAvatar(row)}
          size="md"
          radius="lg"
          style={{ border: "0.125rem solid #e9ecef" }}
        >
          <IconUser size="1.2rem" />
        </Avatar>
      ),
    },
    {
      key: "userName",
      label: "User Name ",
      width: "10rem",
      sortable: true,
      render: (_: any, row: any) => (
        <Text size="sm" fw={500}>
          {getUserDisplayName(row)}
        </Text>
      ),
    },
    {
      key: "description",
      label: "Description ",
      width: "15rem",
      sortable: true,
      render: (value: string) => (
        <Text size="sm" lineClamp={3} fw={500} maw="37.5rem">
          {value}
        </Text>
      ),
    },
    {
      key: "startDate",
      label: "Start Date ",
      width: "8rem",
      sortable: true,
      render: (_: any, row: any) => (
        <Text size="sm" c="#22c55e" fw={500}>
          {formatDate(getTaskDate(row, "start"))}
        </Text>
      ),
    },
    {
      key: "endDate",
      label: "End Date ",
      width: "8rem",
      sortable: true,
      render: (_: any, row: any) => (
        <Text size="sm" c="#f56565" fw={500}>
          {formatDate(getTaskDate(row, "end"))}
        </Text>
      ),
    },
    {
      key: "status",
      label: "Status ",
      width: "9rem",
      sortable: true,
      render: (_: any, row: any) => {
        const taskStatus = getTaskStatus(row);
        return (
          <Badge
            color={taskStatus ? "green" : "red"}
            style={{
              backgroundColor: taskStatus ? "#22c55e" : "#f56565",
              color: "white",
              borderRadius: "0.25rem",
              padding: "1rem 2rem", // أطول وأعرض أكثر
              fontWeight: 600,
              fontSize: "0.875rem",
              minWidth: "12rem",
              textAlign: "center",
            }}
          >
            {taskStatus ? "Completed" : "Not Completed"}
          </Badge>
        );
      },
    },
    {
      key: "action",
      label: "Action",
      width: "5rem",
      render: (_: any, row: any) => renderTaskActions(row),
    },
  ];

  const tableControls = {
    search: {
      enabled: true,
      placeholder: "Search tasks...",
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
      <Group gap="0.75rem">
        <Group gap="0.5rem">
          <ActionIcon
            variant={viewMode === "table" ? "filled" : "outline"}
            color="blue"
            size="sm"
            onClick={() => setViewMode("table")}
          >
            <IconTable size="1rem" />
          </ActionIcon>
          <ActionIcon
            variant={viewMode === "cards" ? "filled" : "outline"}
            color="blue"
            size="sm"
            onClick={() => setViewMode("cards")}
          >
            <IconLayoutGrid size="1rem" />
          </ActionIcon>
        </Group>

        <Button
          leftSection={<IconDownload size="1rem" />}
          variant="outline"
          onClick={handleExportData}
          disabled={filteredTasks.length === 0}
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
          onClick={handleNavigation.addTask}
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
      </Group>
    ),
  };

  const emptyState = {
    title: searchTerm ? "No matching tasks found" : "No tasks available",
    description: searchTerm
      ? "Try adjusting your search criteria"
      : "Tasks will appear here once they're added to the system",
  };

  const renderCardsView = () => (
    <Box>
      <Group justify="space-between" mb="1.5rem">
        <Group gap="0.75rem">
          <Group gap="0.5rem" align="center">
            <Text size="0.875rem" c="#666">
              Show
            </Text>
            <Text size="0.875rem" c="#666">
              {itemsPerPage}
            </Text>
            <Text size="0.875rem" c="#666">
              Row
            </Text>
          </Group>
          <Group gap="0.5rem">
            <ActionIcon
              variant={viewMode === "table" ? "filled" : "outline"}
              color="blue"
              size="sm"
              onClick={() => setViewMode("table")}
            >
              <IconTable size="1rem" />
            </ActionIcon>
            <ActionIcon
              variant={viewMode === "cards" ? "filled" : "outline"}
              color="blue"
              size="sm"
              onClick={() => setViewMode("cards")}
            >
              <IconLayoutGrid size="1rem" />
            </ActionIcon>
          </Group>
        </Group>

        <Group gap="0.75rem">
          <Button
            leftSection={<IconDownload size="1rem" />}
            variant="outline"
            onClick={handleExportData}
            disabled={filteredTasks.length === 0}
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
            onClick={handleNavigation.addTask}
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
        </Group>
      </Group>

      <Box bg="white" style={{ borderRadius: "0.75rem", padding: "1.5rem" }}>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="1.25rem">
          {paginatedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              users={safeUsers}
              onView={handleViewTask}
              onEdit={handleNavigation.editTask}
              onDelete={handleDeleteTask}
              onToggleStatus={handleToggleTaskCompletion}
            />
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );

  if (loading) {
    return (
      <Container size="100%" p="1.5rem">
        <Text size="lg" ta="center">
          Loading tasks...
        </Text>
      </Container>
    );
  }

  return (
    <Container size="100%" p="1.5rem" style={{ minHeight: "100vh" }}>
      {viewMode === "table" ? (
        <ReusableTable
          columns={tableColumns}
          data={paginatedTasks}
          striped
          controls={tableControls}
          emptyState={emptyState}
          containerStyle={{
            backgroundColor: "white",
          }}
        />
      ) : (
        renderCardsView()
      )}
    </Container>
  );
};

export default Tasks;
