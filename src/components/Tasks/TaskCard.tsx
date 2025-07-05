import React from "react";
import { Card, Group, Text, Box, Stack, ActionIcon, Menu } from "@mantine/core";
import {
  IconDots,
  IconFileText,
  IconUser,
  IconCalendar,
  IconEye,
  IconEdit,
  IconTrash,
  IconCheck,
} from "@tabler/icons-react";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    completed?: boolean;
    is_completed?: boolean;
    isCompleted?: boolean;
    startDate?: string;
    start_date?: string;
    endDate?: string;
    end_date?: string;
    assignedUserId?: string;
    user_name?: string;
    userName?: string;
    user_avatar?: string;
    userAvatar?: string;
  };
  users?: unknown[];
  onView?: (taskId: string) => void;
  onEdit?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  onToggleStatus?: (taskId: string, currentStatus: boolean) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  users = [],
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const getUserById = (id: string) => users.find((user) => user.id === id);

  const getUserDisplayName = () => {
    const assignedUser = getUserById(task.assignedUserId || "");
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

  const getTaskStatus = () => {
    return task.completed || task.is_completed || task.isCompleted || false;
  };

  const formatDate = (date: string) => {
    if (!date) return "N/A";
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "Invalid Date";
    return dateObj.toLocaleDateString("en-GB").replace(/\//g, "-");
  };

  const getTaskDate = (dateType: "start" | "end") => {
    if (dateType === "start") {
      return task.startDate || task.start_date || "";
    } else {
      return task.endDate || task.end_date || "";
    }
  };

  const taskStatus = getTaskStatus();
  const userDisplayName = getUserDisplayName();

  const renderTaskActions = () => (
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
          onClick={() => onView?.(task.id)}
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
          onClick={() => onEdit?.(task.id)}
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
          onClick={() => onDelete?.(task.id)}
          styles={{
            item: {
              padding: "0.75rem 1rem",
              fontSize: "0.875rem",
            },
          }}
        >
          Delete
        </Menu.Item>
        <Menu.Item
          leftSection={<IconCheck size="0.875rem" />}
          color={taskStatus ? "orange" : "green"}
          onClick={() => onToggleStatus?.(task.id, taskStatus)}
          styles={{
            item: {
              padding: "0.75rem 1rem",
              fontSize: "0.875rem",
            },
          }}
        >
          {taskStatus ? "Mark As Pending" : "Mark As Completed"}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );

  return (
    <Card
      shadow="sm"
      padding="1.5rem"
      radius="0.75rem"
      bg="#f8f9fa"
      style={{
        textAlign: "center",
        border: "0.0625rem solid #e9ecef",
        transition: "all 0.2s ease",
      }}
      styles={{
        root: {
          "&:hover": {
            transform: "translateY(-0.125rem)",
            boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.1)",
          },
        },
      }}
    >
      <Group justify="space-between" mb="1rem">
        <Box style={{ flex: 1 }} />
        {renderTaskActions()}
      </Group>

      <Box
        style={{
          width: "4rem",
          height: "4rem",
          backgroundColor: "#2563eb",
          borderRadius: "0.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.5rem auto",
        }}
      >
        <IconFileText size="2rem" color="white" />
      </Box>

      <Text fw={600} size="lg" mb="1rem" lineClamp={2}>
        {task.title}
      </Text>

      <Text
        size="sm"
        c="dimmed"
        mb="2rem"
        lineClamp={3}
        style={{ textAlign: "center" }}
      >
        {task.description}
      </Text>

      <Stack gap="1rem">
        <Group justify="space-between" align="center">
          <Group gap="xs" align="center">
            <IconUser size="1.125rem" color="#333" />
            <Text size="sm" c="#333">
              {userDisplayName}
            </Text>
          </Group>

          <Group gap="xs" align="center">
            <Box
              w="0.75rem"
              h="0.75rem"
              style={{
                borderRadius: "50%",
                border: `0.125rem solid ${taskStatus ? "#22c55e" : "#f56565"}`,
                backgroundColor: "transparent",
                position: "relative",
              }}
            >
              {taskStatus && (
                <Box
                  w="0.375rem"
                  h="0.375rem"
                  style={{
                    borderRadius: "50%",
                    backgroundColor: "#22c55e",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              )}
            </Box>
            <Text size="sm" c={taskStatus ? "#22c55e" : "#f56565"} fw={500}>
              {taskStatus ? "Completed" : "Not Completed"}
            </Text>
          </Group>
        </Group>

        <Group justify="space-between" align="center">
          <Group gap="xs" align="center">
            <IconCalendar size="1.125rem" color="#22c55e" />
            <Text size="sm" c="#22c55e" fw={500}>
              {formatDate(getTaskDate("start"))}
            </Text>
          </Group>

          <Group gap="xs" align="center">
            <IconCalendar size="1.125rem" color="#f56565" />
            <Text size="sm" c="#f56565" fw={500}>
              {formatDate(getTaskDate("end"))}
            </Text>
          </Group>
        </Group>
      </Stack>
    </Card>
  );
};
