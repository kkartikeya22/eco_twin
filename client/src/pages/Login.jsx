import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Button, ErrorBanner, Field } from "../components/ui";
import { IconLeaf, IconMail, IconLock } from "../components/icons";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const { data } = await api.post("/api/auth/login", formData);

      login(data.user, data.token);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar px-4 py-10">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-[var(--radius-card)] bg-brand text-white">
            <IconLeaf className="h-5 w-5" />
          </div>
          <h1 className="text-[22px] font-bold tracking-tight text-ink">
            Welcome back
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-2">
            Log in to continue tracking your carbon footprint.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="surface-card space-y-4 p-6 sm:p-7"
        >
          {error && <ErrorBanner>{error}</ErrorBanner>}

          <Field label="Email">
            <div className="relative">
              <IconMail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="field-input pl-9"
                required
              />
            </div>
          </Field>

          <Field label="Password">
            <div className="relative">
              <IconLock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="field-input pl-9"
                required
              />
            </div>
          </Field>

          <Button type="submit" loading={loading} className="w-full">
            {loading ? "Logging in…" : "Log in"}
          </Button>

          <p className="text-center text-[13.5px] text-ink-2">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-brand hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}