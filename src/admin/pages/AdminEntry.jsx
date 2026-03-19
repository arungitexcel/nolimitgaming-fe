import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { postManagerData } from "../../api/ManagerClient";
import { useManagerAuth } from "../../context/ManagerAuthContext";
import authbg from "../../assets/authbg.jpeg";
import "./AdminEntry.css";

export default function AdminEntry() {
  const navigate = useNavigate();
  const { isManagerLoggedIn, loadManager } = useManagerAuth();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  useEffect(() => {
    if (isManagerLoggedIn && localStorage.getItem("managerToken")) {
      navigate("/admin/users", { replace: true });
    }
  }, [isManagerLoggedIn, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await postManagerData("/manager/login", form);
    const token = res?.token || res?.data?.token;
    if (token) {
      localStorage.setItem("managerToken", token);
      const manager = await loadManager();
      if (manager) {
        navigate("/admin/users", { replace: true });
      } else {
        Swal.fire("Login failed", "Unable to load manager profile.", "error");
      }
    } else if (res?.message) {
      Swal.fire("Login failed", res.message, "error");
    }
    setSubmitting(false);
  };

  return (
    <div className="AdminEntry-overlay">
      <div className="AdminEntry-container">
        <div className="AdminEntry-section-first">
          <img src={authbg} alt="Background" className="AdminEntry-auth-bg" />
          <div className="AdminEntry-ads">
            <h1>Manager Panel</h1>
            <p>Login to manage your users</p>
          </div>
        </div>

        <div className="AdminEntry-section-second">
          <div className="AdminEntry-header">
            <h2 style={{ fontWeight: "700" }}>Manager Login</h2>
          </div>

          <form className="AdminEntry-form" onSubmit={onSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={(e) =>
                  setForm((p) => ({ ...p, username: e.target.value }))
                }
                autoComplete="username"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
                autoComplete="current-password"
                required
              />
            </div>

            <button className="AdminEntry-btn" type="submit" disabled={submitting}>
              {submitting ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

