import { AppShell, Group, Text, Avatar, Box, ActionIcon } from "@mantine/core";
import { IconMenu2 } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import { useLocation } from "react-router-dom";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const location = useLocation();

  const getPageTitle = (pathname: string): string => {
    const pathSegments = pathname.slice(1).split("/");

    switch (pathSegments[0]) {
      case "":
        return "Dashboard";
      case "tasks":
        if (pathSegments[1] === "add") return "Add Task";
        if (pathSegments[1] === "edit") return "Edit Task";
        return "Tasks";
      case "users":
        if (pathSegments[1] === "add") return "Add User";
        if (pathSegments[1] === "edit") return "Edit User";
        return "Users";
      default:
        return "Dashboard";
    }
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <AppShell.Header
      style={{
        backgroundColor: "#ffffff !important",
        borderBottom: "1px solid rgb(201, 201, 201)",
        padding: "0 1rem",
        paddingLeft: isMobile ? "1rem" : "calc(17.5rem + 1rem)",
      }}
    >
      <Group h="100%" justify="space-between" align="center">
        <Group gap="md" align="center">
          {isMobile && (
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              onClick={onToggleSidebar}
            >
              <IconMenu2 size={20} />
            </ActionIcon>
          )}
          <Text
            size="lg"
            fw={700}
            c="black"
            style={{ letterSpacing: "0.025rem" }}
          >
            {pageTitle}
          </Text>
        </Group>

        <Group gap="md" align="center">
          <Avatar
            src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1"
            size={40}
            radius="xl"
          />
          {!isMobile && (
            <Box style={{ textAlign: "left" }}>
              <Text size="sm" fw={600} c="#333" lh={1.2}>
                Hassan Aljeahi
              </Text>
              <Text size="xs" c="#999" lh={1.2}>
                Email@example.com
              </Text>
            </Box>
          )}
        </Group>
      </Group>
    </AppShell.Header>
  );
}
