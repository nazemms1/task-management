import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  FileInput,
  Grid,
} from "@mantine/core";
import { IconArrowLeft, IconUpload, IconCalendar } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import type { RootState, AppDispatch } from "../../store/store";
import { createTask } from "../../store/slices/tasksSlice";
import type { CreateTaskRequest } from "../../types";

const AddTask: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading: usersLoading } = useSelector(
    (state: RootState) => state.users
  );
  const { loading: tasksLoading } = useSelector(
    (state: RootState) => state.tasks
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<CreateTaskRequest>({
    initialValues: {
      title: "",
      description: "",
      completed: false,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      assignedUserId: "",
    },
    validate: {
      title: (value) => (!value.trim() ? "Title is required" : null),
      description: (value) =>
        !value.trim() ? "Description is required" : null,
      assignedUserId: (value) => (!value ? "Please select a user" : null),
      startDate: (value) => (!value ? "Start date is required" : null),
      endDate: (value, values) => {
        if (!value) return "End date is required";
        if (values.startDate && new Date(value) < new Date(values.startDate)) {
          return "End date must be after start date";
        }
        return null;
      },
    },
  });

  const safeUsers = users || [];
  const userSelectData = safeUsers.map((user) => ({
    value: user.id,
    label: user.name || `${user.first_name} ${user.last_name}`,
  }));

  const handleSubmit = async (values: CreateTaskRequest) => {
    try {
      await dispatch(createTask(values)).unwrap();
      notifications.show({
        title: "Success",
        message: "Task created successfully",
        color: "green",
      });
      navigate("/tasks");
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to create task",
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
        borderColor: "#4A90E2",
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
    width: "12.5rem",
    height: "2.8125rem",
    borderRadius: "0.375rem",
    fontSize: "1rem",
    fontWeight: 600,
    "&:hover": {
      backgroundColor: "#3a7bc8",
    },
  };

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
              <Stack gap="0.5rem">
                <Text size="0.875rem" fw={500} c="#333">
                  Username
                </Text>
                <Select
                  placeholder="Select user"
                  data={userSelectData}
                  {...form.getInputProps("assignedUserId")}
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
                  error={form.errors.startDate}
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
                  error={form.errors.endDate}
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
                      {imageFile ? imageFile.name : "No File chosen"}
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
          </Grid>

          <Group justify="center" mt="2rem">
            <Button
              type="submit"
              loading={tasksLoading}
              size="lg"
              style={buttonStyle}
            >
              Save Task
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default AddTask;
