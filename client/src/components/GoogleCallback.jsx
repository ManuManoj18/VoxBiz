import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../lib/api";

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (!code) return navigate("/login");

      try {
  const res = await fetch(`${API_BASE_URL}/api/auth/google/callback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        const data = await res.json();

        if (data.success) {
          localStorage.setItem("token", data.jwt);
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/dashboard");
        } else {
          alert(data.message);
          navigate("/login");
        }
      } catch (error) {
        console.error("Google callback error:", error);
        navigate("/login");
      }
    };

    handleGoogleCallback();
  }, [navigate]);

  return <p>Signing in with Google...</p>;
};

export default GoogleCallback;