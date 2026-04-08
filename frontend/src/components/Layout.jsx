import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { getMe } from "../services/authService";

const Layout = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getMe();
      if (res?.user) setUser(res.user);
    };
    fetchUser();
  }, []);

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