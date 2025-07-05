import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Group,
  Text,
  TextInput,
  Textarea,
  Select,
  Button,
  Box,
  Paper,
  Stack,
  ActionIcon,
  Grid,
  Switch,
  Avatar,
} from "@mantine/core";
import { IconArrowLeft, IconCalendar } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import type { RootState, AppDispatch } from "../../store/store";
import { updateTask, fetchTaskById } from "../../store/slices/tasksSlice";
import type { Task } from "../../types";

const EditTask: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { currentTask, loading: tasksLoading } = useSelector(
    (state: RootState) => state.tasks
  );
  const { users } = useSelector((state: RootState) => state.users);

  const form = useForm<Task>({
    initialValues: {
      id: "",
      title: "",
      description: "",
      completed: false,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      assignedUserId: "",
      createdAt: "",
      updatedAt: "",
    },
    validate: {
      title: (value) => (!value.trim() ? "Title is required" : null),
      description: (value) =>
        !value.trim() ? "Description is required" : null,
      assignedUserId: (value) => (!value ? "Please select a user" : null),
    },
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchTaskById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentTask) {
      form.setValues(currentTask);
    }
  }, [currentTask]);

  const safeUsers = users || [];
  const userSelectData = safeUsers.map((user) => ({
    value: user.id,
    label: user.name || `${user.first_name} ${user.last_name}`,
    avatar: user.avatar,
  }));

  const handleSubmit = async (values: Task) => {
    try {
      await dispatch(updateTask(values)).unwrap();
      notifications.show({
        title: "Success",
        message: "Task updated successfully",
        color: "green",
      });
      navigate("/tasks");
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update task",
        color: "red",
      });
    }
  };

  const handleBack = () => navigate("/tasks");

  const inputStyles = {
    input: {
      border: "0.0625rem solid #e0e0e0",
      borderRadius: "0.375rem",
      padding: "0.75rem",
      fontSize: "0.875rem",
      "&:focus": {
        boxShadow: "0 0 0 0.125rem rgba(74, 144, 226, 0.2)",
      },
    },
  };

  const headerStyle = {
    backgroundColor: "blue",
    color: "white",
    padding: "1rem 1.5rem",
    borderRadius: "0.5rem 0.5rem 0 0",
    fontWeight: 600,
    fontSize: "1rem",
  };

  const paperStyle = {
    borderRadius: "0 0 0.5rem 0.5rem",
    padding: "2rem",
    backgroundColor: "white",
    boxShadow: "0 0.125rem 0.5rem rgba(0, 0, 0, 0.1)",
  };

  const buttonStyle = {
    backgroundColor: "#4A90E2",
    width: "12.5rem",
    height: "2.8125rem",
    borderRadius: "0.375rem",
    fontSize: "1rem",
    fontWeight: 600,
    "&:hover": {
      backgroundColor: "#3a7bc8",
    },
  };

  const currentUserStyle = {
    backgroundColor: "#f8f9fa",
    borderRadius: "0.375rem",
    padding: "0.75rem",
    border: "0.0625rem solid #e9ecef",
  };

  const renderUserOption = ({ option }: any) => {
    const userData = userSelectData.find((u) => u.value === option.value);
    return (
      <Group gap="0.75rem">
        <Avatar src={userData?.avatar} size="2rem" />
        <Text size="0.875rem">{option.label}</Text>
      </Group>
    );
  };

  function setImageFile(arg0: File): void {
    throw new Error("Function not implemented.");
  }

  return (
    <Container
      size="100%"
      p="1.5rem"
      style={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <Box style={headerStyle}>Task Details</Box>

      <Paper shadow="sm" style={paperStyle}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid gutter="1.5rem">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="0.5rem">
                <Text size="0.875rem" fw={500} c="#333">
                  Title
                </Text>
                <TextInput
                  placeholder="Enter task title"
                  {...form.getInputProps("title")}
                  styles={inputStyles}
                />
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="0.75rem">
                <Text size="0.875rem" fw={500} c="#333">
                  Username
                </Text>

                {currentTask && currentTask.user_name && (
                  <Group gap="0.75rem" style={currentUserStyle}>
                    <Avatar src={currentTask.user_avatar} size="2rem" />
                    <Box>
                      <Text size="0.875rem" fw={500}>
                        Current: {currentTask.user_name}
                      </Text>
                      <Text size="0.75rem" c="dimmed">
                        ID: {currentTask.assignedUserId}
                      </Text>
                    </Box>
                  </Group>
                )}

                <Select
                  placeholder="Select new user"
                  data={userSelectData}
                  {...form.getInputProps("assignedUserId")}
                  renderOption={renderUserOption}
                  styles={inputStyles}
                  searchable
                />
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="0.5rem">
                <Text size="0.875rem" fw={500} c="#333">
                  Start Date
                </Text>
                <DateInput
                  placeholder="Select start date"
                  value={
                    form.values.startDate
                      ? new Date(form.values.startDate)
                      : null
                  }
                  onChange={(date) =>
                    form.setFieldValue(
                      "startDate",
                      date?.toISOString().split("T")[0] || ""
                    )
                  }
                  styles={inputStyles}
                />
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="0.5rem">
                <Text size="0.875rem" fw={500} c="#333">
                  End Date
                </Text>
                <DateInput
                  placeholder="Select end date"
                  value={
                    form.values.endDate ? new Date(form.values.endDate) : null
                  }
                  onChange={(date) =>
                    form.setFieldValue(
                      "endDate",
                      date?.toISOString().split("T")[0] || ""
                    )
                  }
                  styles={inputStyles}
                />
              </Stack>
            </Grid.Col>

            <Grid.Col span={12}>
              <Stack gap="0.5rem">
                <Text size="0.875rem" fw={500} c="#333">
                  Description
                </Text>
                <Textarea
                  placeholder="Enter task description"
                  autosize
                  minRows={4}
                  maxRows={8}
                  {...form.getInputProps("description")}
                  styles={inputStyles}
                />
              </Stack>
            </Grid.Col>
            <Grid.Col span={12}>
              <Stack gap="0.75rem">
                <Text size="0.875rem" fw={500} c="#333">
                  Image
                </Text>
                <Box
                  style={{
                    display: "flex",
                    border: "0.0625rem solid #e0e0e0",
                    borderRadius: "0.375rem",
                    overflow: "hidden",
                    maxWidth: "30rem",
                  }}
                >
                  <Button
                    variant="filled"
                    style={{
                      backgroundColor: "blue",
                      color: "white",
                      border: "none",
                      borderRadius: "0.075rem 0 0 0.375rem",
                      padding: "0.75rem 1rem",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      flexShrink: 0,
                      height: "100%",
                    }}
                    styles={{
                      root: {
                        "&:hover": {
                          backgroundColor: "#0056b3",
                        },
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                      },
                    }}
                    onClick={() =>
                      document.getElementById("file-input").click()
                    }
                  >
                    Choose File
                  </Button>
                  <Box
                    style={{
                      flex: 1,
                      padding: "0.75rem",
                      backgroundColor: "#f8f9fa",
                      display: "flex",
                      alignItems: "center",
                      borderLeft: "0.0625rem solid #e0e0e0",
                    }}
                  >
                    <Text size="0.875rem" c="#666">
                      {setImageFile ? setImageFile.name : "No File chosen"}
                    </Text>
                  </Box>
                </Box>
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </Stack>
            </Grid.Col>
            <Grid.Col span={12}></Grid.Col>
          </Grid>

          <Group justify="center" mt="2rem">
            <Button
              type="submit"
              loading={tasksLoading}
              size="lg"
              style={buttonStyle}
            >
              Update Task
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default EditTask;
