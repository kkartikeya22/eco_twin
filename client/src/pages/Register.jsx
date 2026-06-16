import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Button, ErrorBanner, Field } from "../components/ui";
import { IconLeaf, IconMail, IconLock, IconUser } from "../components/icons";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
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

      const { data } = await api.post("/api/auth/register", formData);

      login(data.user, data.token);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
            Create your account
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-2">
            Start your EcoTwin workspace and track your impact.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="surface-card space-y-4 p-6 sm:p-7"
        >
          {error && <ErrorBanner>{error}</ErrorBanner>}

          <Field label="Full name">
            <div className="relative">
              <IconUser className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
              <input
                type="text"
                name="name"
                placeholder="Jane Doe"
                value={formData.name}
                onChange={handleChange}
                className="field-input pl-9"
                required
              />
            </div>
          </Field>

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
            {loading ? "Creating account…" : "Create account"}
          </Button>

          <p className="text-center text-[13.5px] text-ink-2">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-brand hover:underline"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
