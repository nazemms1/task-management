import {
  AppShell,
  Box,
  Group,
  Text,
  Stack,
  UnstyledButton,
} from "@mantine/core";
import {
  IconLayoutDashboard,
  IconChecklist,
  IconUsers,
  IconLogout,
} from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";

interface SidebarProps {
  opened?: boolean;
  onClose?: () => void;
}

const SIDEBAR_WIDTH = "17.5rem";
const MOBILE_BREAKPOINT = "(max-width: 768px)";

const BRAND_CONFIG = {
  title: "DIMENSION GROUP",
  subtitle: "Where experts meet",
  logoBarWidths: ["100%", "70%", "85%", "60%", "90%", "75%"],
  logoBarPositions: ["0", "0.4rem", "0.9rem", "1.3rem", "1.75rem", "2.2rem"],
};

const NAV_STYLES = {
  activeItem: {
    background: "rgba(74, 144, 226, 0.1)",
    border: "0.125rem solid #4A90E2",
  },
  inactiveItem: {
    background: "white",
    border: "0.125rem solid white",
  },
  hoverState: {
    background: "rgba(255, 255, 255, 0.8)",
  },
  logoutButton: {
    borderColor: "#ff4757",
    textColor: "#ff4757",
    hoverBackground: "#ff4757",
  },
};

export function Sidebar({ opened = true, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT);

  const navigationItems = [
    { icon: IconLayoutDashboard, label: "Dashboard", path: "/" },
    { icon: IconChecklist, label: "Tasks", path: "/tasks" },
    { icon: IconUsers, label: "Users", path: "/users" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const renderLogo = () => (
    <Box w="2.5rem" h="2.5rem" pos="relative">
      {BRAND_CONFIG.logoBarWidths.map((width, index) => (
        <Box
          key={index}
          pos="absolute"
          top={BRAND_CONFIG.logoBarPositions[index]}
          right={0}
          w={width}
          h="0.2rem"
          bg="#000000"
          style={{ borderRadius: "0.0625rem" }}
        />
      ))}
    </Box>
  );

  const renderBrandSection = () => (
    <Box mb="2.5rem">
      <Group align="center" gap="sm" mb="xs">
        {renderLogo()}
        <Box>
          <Text
            size="lg"
            fw={700}
            c="#000000"
            lh={1.1}
            style={{ letterSpacing: "0.03125rem" }}
          >
            {BRAND_CONFIG.title}
          </Text>
        </Box>
      </Group>
      <Text
        size="sm"
        c="#666666"
        pl="3.125rem"
        style={{ letterSpacing: "0.01875rem" }}
      >
        {BRAND_CONFIG.subtitle}
      </Text>
    </Box>
  );

  const renderNavigationItem = (item: (typeof navigationItems)[0]) => {
    const isActive = location.pathname === item.path;
    const itemStyles = isActive
      ? NAV_STYLES.activeItem
      : NAV_STYLES.inactiveItem;

    return (
      <UnstyledButton
        key={item.path}
        onClick={() => handleNavigation(item.path)}
        style={{
          padding: "1rem 1.25rem",
          borderRadius: "3.125rem",
          backgroundColor: itemStyles.background,
          border: itemStyles.border,
          transition: "all 0.3s ease",
          width: "100%",
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor =
              NAV_STYLES.hoverState.background;
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor =
              NAV_STYLES.inactiveItem.background;
          }
        }}
      >
        <Group gap="md" align="center">
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "1.5rem",
              height: "1.5rem",
            }}
          >
            <item.icon
              size={24}
              style={{
                color: "black",
                strokeWidth: 1.5,
              }}
            />
          </Box>
          <Text
            size="md"
            fw={isActive ? 600 : 500}
            style={{
              color: "black",
              letterSpacing: "0.01875rem",
            }}
          >
            {item.label}
          </Text>
        </Group>
      </UnstyledButton>
    );
  };

  const renderLogoutButton = () => (
    <UnstyledButton
      style={{
        padding: "1rem 1.25rem",
        borderRadius: "3.125rem",
        border: `0.125rem solid ${NAV_STYLES.logoutButton.borderColor}`,
        backgroundColor: "transparent",
        transition: "all 0.3s ease",
        width: "100%",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor =
          NAV_STYLES.logoutButton.hoverBackground;
        const elements = e.currentTarget.querySelectorAll(
          "[data-logout-element]"
        );
        elements.forEach((el) => {
          (el as HTMLElement).style.color = "#ffffff";
        });
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        const elements = e.currentTarget.querySelectorAll(
          "[data-logout-element]"
        );
        elements.forEach((el) => {
          (el as HTMLElement).style.color = NAV_STYLES.logoutButton.textColor;
        });
      }}
    >
      <Group gap="md" align="center" justify="center">
        <IconLogout
          size={20}
          data-logout-element="true"
          style={{
            color: NAV_STYLES.logoutButton.textColor,
            transition: "color 0.3s ease",
            strokeWidth: 1.5,
          }}
        />
        <Text
          data-logout-element="true"
          size="md"
          fw={500}
          style={{
            color: NAV_STYLES.logoutButton.textColor,
            transition: "color 0.3s ease",
            letterSpacing: "0.01875rem",
          }}
        >
          Logout
        </Text>
      </Group>
    </UnstyledButton>
  );

  const overlayStyles = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  };

  const navbarStyles = {
    backgroundColor: "#f8f9fa",
    borderRight: "none",
    width: SIDEBAR_WIDTH,
    height: "100vh",
    position: "fixed" as const,
    top: 0,
    left: isMobile ? (opened ? 0 : `-${SIDEBAR_WIDTH}`) : 0,
    zIndex: 1000,
    transition: "left 0.3s ease",
  };

  return (
    <>
      {isMobile && opened && <Box style={overlayStyles} onClick={onClose} />}

      <AppShell.Navbar p={0} style={navbarStyles}>
        <Stack h="100%" justify="space-between" gap={0} p="xl">
          <Box>
            {renderBrandSection()}
            <Stack gap="md">{navigationItems.map(renderNavigationItem)}</Stack>
          </Box>

          <Box pt="xl">{renderLogoutButton()}</Box>
        </Stack>
      </AppShell.Navbar>
    </>
  );
}
