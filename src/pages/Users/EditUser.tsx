import React, { useState, useEffect } from "react";
import {
  Container,
  Group,
  Text,
  TextInput,
  Button,
  Box,
  Paper,
  Stack,
  Grid,
  Loader,
  Center,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store/store";
import { updateUser, fetchUserById } from "../../store/slices/usersSlice";

interface UpdateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
}

const EditUser: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  const { currentUser } = useSelector((state: RootState) => state.users);

  const form = useForm<UpdateUserRequest>({
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

  useEffect(() => {
    const loadUserData = async () => {
      if (!id) {
        navigate("/users");
        return;
      }

      try {
        setDataLoading(true);
        await dispatch(fetchUserById(id)).unwrap();
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Failed to load user data",
          color: "red",
        });
        navigate("/users");
      } finally {
        setDataLoading(false);
      }
    };

    loadUserData();
  }, [id, dispatch, navigate]);

  useEffect(() => {
    if (currentUser) {
      form.setValues({
        first_name: currentUser.first_name || "",
        last_name: currentUser.last_name || "",
        email: currentUser.email || "",
      });
    }
  }, [currentUser]);

  const handleSubmit = async (values: UpdateUserRequest) => {
    if (!id) return;

    setLoading(true);
    try {
      await dispatch(updateUser({ id, userData: values })).unwrap();
      notifications.show({
        title: "Success",
        message: "User updated successfully",
        color: "green",
      });
      navigate("/users");
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update user",
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

  if (dataLoading) {
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
        <Center h="50vh">
          <Stack align="center" gap="1rem">
            <Loader size="lg" />
            <Text size="lg" c="dimmed">
              Loading user data...
            </Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  if (!currentUser) {
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
        <Center h="50vh">
          <Stack align="center" gap="1rem">
            <Text size="xl" c="red" fw={600}>
              User not found
            </Text>
            <Button onClick={handleBack} variant="light">
              Back to Users
            </Button>
          </Stack>
        </Center>
      </Container>
    );
  }

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
              Update User
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default EditUser;
