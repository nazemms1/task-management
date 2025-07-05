import React, { useState } from "react";
import {
  Container,
  Group,
  Text,
  TextInput,
  Button,
  Box,
  Paper,
  Stack,
  ActionIcon,
  Grid,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../store/store";
import { createUser } from "../../store/slices/usersSlice";

interface CreateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
}

const AddUser: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<CreateUserRequest>({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
    },
    validate: {
      first_name: (value) => (!value.trim() ? "First name is required" : null),
      last_name: (value) => (!value.trim() ? "Last name is required" : null),
      email: (value) => {
        if (!value.trim()) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Please enter a valid email";
        return null;
      },
    },
  });

  const handleSubmit = async (values: CreateUserRequest) => {
    setLoading(true);
    try {
      await dispatch(createUser(values)).unwrap();
      notifications.show({
        title: "Success",
        message: "User created successfully",
        color: "green",
      });
      navigate("/users");
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to create user",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => navigate("/users");

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
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <Box style={headerStyle}>User Details</Box>

      <Paper shadow="sm" style={paperStyle}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid gutter="1.5rem">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="0.5rem">
                <Text size="0.875rem" fw={500} c="#333">
                  First Name
                </Text>
                <TextInput
                  placeholder="Enter first name"
                  {...form.getInputProps("first_name")}
                  styles={inputStyles}
                />
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="0.5rem">
                <Text size="0.875rem" fw={500} c="#333">
                  Last Name
                </Text>
                <TextInput
                  placeholder="Enter last name"
                  {...form.getInputProps("last_name")}
                  styles={inputStyles}
                />
              </Stack>
            </Grid.Col>

            <Grid.Col span={12}>
              <Stack gap="0.5rem">
                <Text size="0.875rem" fw={500} c="#333">
                  Email Address
                </Text>
                <TextInput
                  placeholder="Enter email address"
                  {...form.getInputProps("email")}
                  styles={inputStyles}
                />
              </Stack>
            </Grid.Col>

            <Grid.Col span={12}>
              <Stack gap="0.75rem">
                <Text size="0.875rem" fw={500} c="#333">
                  Profile Image
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
              loading={loading}
              size="lg"
              style={buttonStyle}
            >
              Save User
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default AddUser;
