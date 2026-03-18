import { NavLink, useLocation } from "react-router-dom";
import { Button, Layout, Menu, Typography } from "antd";
import { ShieldCheck, Users } from "lucide-react";
import { useManagerAuth } from "../context/ManagerAuthContext";

const { Sider } = Layout;

export default function AdminSidebar() {
  const { manager, logoutManager } = useManagerAuth();
  const location = useLocation();
  const selectedKey = location.pathname.startsWith("/admin/users")
    ? "/admin/users"
    : location.pathname.startsWith("/admin/kyc")
      ? "/admin/kyc"
      : location.pathname;

  const items = [
    {
      key: "/admin/users",
      icon: <Users size={16} />,
      label: <NavLink to="/admin/users">Users</NavLink>,
    },
    {
      key: "/admin/kyc",
      icon: <ShieldCheck size={16} />,
      label: <NavLink to="/admin/kyc">KYC</NavLink>,
    },
  ];

  return (
    <Sider
      width={260}
      breakpoint="lg"
      collapsedWidth={72}
      className="AdminSidebar"
    >
      <div className="AdminSidebarTop">
        <div className="AdminSidebarBrand">
          <Typography.Text className="AdminSidebarBrandTitle">Admin</Typography.Text>
          <div className="AdminSidebarBrandMeta">
            {manager?.username ? `@${manager.username}` : ""}
          </div>
        </div>
      </div>

      <Menu
        theme="dark"
        mode="inline"
        items={items}
        selectable
        selectedKeys={[selectedKey]}
        className="AdminSidebarMenu"
      />

      <div className="AdminSidebarBottom">
        <Button
          type="default"
          onClick={logoutManager}
          className="AdminLogoutBtn"
          aria-label="Log out"
        >
          Logout
        </Button>
      </div>
    </Sider>
  );
}

