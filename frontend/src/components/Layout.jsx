import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { getMe } from "../services/authService";

const Layout = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getMe();
      if (res?.user) {
        setUser(res.user);
      } else {
        navigate("/login");
      }
      setLoading(false);
    };
    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f8fc]">
        <div className="w-10 h-10 border-4 border-[#6A2AFF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <Navbar user={user} />
      <main className="p-5 md:p-8">
        <Outlet context={{ user }} />
      </main>
    </div>
  );
};

export default Layout;