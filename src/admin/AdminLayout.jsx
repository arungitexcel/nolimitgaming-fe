import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ConfigProvider, Layout, Typography, theme } from "antd";
import AdminSidebar from "./AdminSidebar";
import "./admin.css";

const { Header, Content } = Layout;

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // If someone lands on /admin (protected branch), send them to the first page.
    if (location.pathname === "/admin") {
      navigate("/admin/users", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgBase: "var(--background-color)",
          colorBgContainer: "rgba(255,255,255,0.04)",
          colorBorder: "rgba(255,255,255,0.10)",
          colorText: "rgba(255,255,255,0.92)",
          colorTextSecondary: "rgba(255,255,255,0.62)",
          colorPrimary: "#24ee89",
          borderRadius: 14,
          fontFamily: "var(--font-family)",
        },
        components: {
          Layout: {
            headerBg: "var(--background-color)",
            siderBg: "var(--background-color)",
            bodyBg: "var(--background-color)",
          },
          Menu: {
            darkItemBg: "transparent",
            darkSubMenuItemBg: "transparent",
            darkItemHoverBg: "rgba(36,238,137,0.10)",
            darkItemSelectedBg: "rgba(36,238,137,0.16)",
            darkItemSelectedColor: "rgba(255,255,255,0.95)",
          },
          Table: {
            headerBg: "rgba(255,255,255,0.04)",
            headerColor: "rgba(255,255,255,0.82)",
            rowHoverBg: "rgba(36,238,137,0.08)",
            borderColor: "rgba(255,255,255,0.08)",
          },
          Drawer: {
            colorBgElevated: "var(--background-color)",
          },
          Input: {
            colorBgContainer: "rgba(255,255,255,0.04)",
            colorBorder: "rgba(255,255,255,0.12)",
            colorTextPlaceholder: "rgba(255,255,255,0.42)",
          },
          Button: {
            defaultBg: "rgba(255,255,255,0.04)",
            defaultBorderColor: "rgba(255,255,255,0.14)",
            defaultColor: "rgba(255,255,255,0.92)",
            primaryColor: "#05110b",
          },
        },
      }}
    >
      <Layout className="AdminLayoutRoot">
        <AdminSidebar />
        <Layout className="AdminLayoutMain">
          <Header className="AdminHeader">
            <Typography.Text className="AdminHeaderTitle">Manager Dashboard</Typography.Text>
            <Typography.Text className="AdminHeaderPath">{location.pathname}</Typography.Text>
          </Header>
          <Content className="AdminContent">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

