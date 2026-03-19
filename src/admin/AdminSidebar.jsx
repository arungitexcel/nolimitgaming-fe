import { NavLink, useLocation } from "react-router-dom";
import { Button, Layout, Menu, Typography } from "antd";
import {
  EyeOff,
  MapPinned,
  ShieldCheck,
  TrendingUp,
  TicketPercent,
  Users,
  Wallet,
} from "lucide-react";
import { useManagerAuth } from "../context/ManagerAuthContext";

const { Sider } = Layout;

export default function AdminSidebar() {
  const { manager, logoutManager } = useManagerAuth();
  const location = useLocation();
  const selectedKey = location.pathname.startsWith("/admin/users")
    ? "/admin/users"
    : location.pathname.startsWith("/admin/kyc")
      ? "/admin/kyc"
      : location.pathname.startsWith("/admin/promo-codes")
        ? "/admin/promo-codes"
        : location.pathname.startsWith("/admin/wallet-bonus")
          ? "/admin/wallet-bonus"
          : location.pathname.startsWith("/admin/geofence")
            ? "/admin/geofence"
            : location.pathname.startsWith("/admin/polymarket-category-visibility")
              ? "/admin/polymarket-category-visibility"
              : location.pathname.startsWith("/admin/prediction-reports")
                ? "/admin/prediction-reports"
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
    {
      key: "/admin/promo-codes",
      icon: <TicketPercent size={16} />,
      label: <NavLink to="/admin/promo-codes">Promo Codes</NavLink>,
    },
    {
      key: "/admin/wallet-bonus",
      icon: <Wallet size={16} />,
      label: <NavLink to="/admin/wallet-bonus">Wallet & Bonus</NavLink>,
    },
    {
      key: "/admin/geofence",
      icon: <MapPinned size={16} />,
      label: <NavLink to="/admin/geofence">Geofence</NavLink>,
    },
    {
      key: "/admin/polymarket-category-visibility",
      icon: <EyeOff size={16} />,
      label: (
        <NavLink to="/admin/polymarket-category-visibility">
          Polymarket Visibility
        </NavLink>
      ),
    },
    {
      key: "/admin/prediction-reports",
      icon: <TrendingUp size={16} />,
      label: <NavLink to="/admin/prediction-reports">Prediction Reports</NavLink>,
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

