import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../services/authService";

const RootRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getMe();

      if (user) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  return null; // blank screen for a moment
};

export default RootRedirect;
