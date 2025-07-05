import { Routes, Route } from "react-router-dom";
import { AppShell } from "@mantine/core";
import { Header } from "./components/Layout/Header";
import { Sidebar } from "./components/Layout/Sidebar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Users from "./pages/Users/Users";
import Tasks from "./pages/Tasks/Tasks";
import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
import AddTask from "./pages/Tasks/AddTask";
import EditTask from "./pages/Tasks/EditTask";
import AddUser from "./pages/Users/AddUser";
import EditUser from "./pages/Users/EditUser";

function App() {
  const [sidebarOpened, setSidebarOpened] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const toggleSidebar = () => setSidebarOpened(!sidebarOpened);
  const closeSidebar = () => setSidebarOpened(false);

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{ width: 280, breakpoint: "sm" }}
      padding={0}
      styles={{
        main: {
          backgroundColor: "#ffffff",
          minHeight: "100vh",
        },
        navbar: {
          backgroundColor: "#ffffff",
          borderRight: "none",
        },
        header: {
          backgroundColor: "#ffffff",
        },
      }}
    >
      <Sidebar
        opened={isMobile ? sidebarOpened : true}
        onClose={closeSidebar}
      />

      <Header onToggleSidebar={toggleSidebar} />

      <AppShell.Main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/add" element={<AddTask />} />
          <Route path="/tasks/edit/:id" element={<EditTask />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/add" element={<AddUser />} />
          <Route path="/users/edit/:id" element={<EditUser />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
