import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserLogin from "./pages/auth/UserLogin";
import UserRegister from "./pages/auth/UserRegister";
import UserDashboard from "./pages/user/UserDashboard";
import RootRedirect from "./pages/RootRedirect";

import BuddyLogin from "./pages/buddy/BuddyLogin";
import BuddyRegister from "./pages/buddy/BuddyRegister";
import BuddyDashboard from "./pages/buddy/BuddyDashboard";

import CreateNewTask from "./pages/user/CreateNewTask";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminRegister from "./pages/admin/AdminRegister";
import AdminDashboard from "./pages/admin/AdminDashboard";

import Payment from "./pages/Payment";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<RootRedirect />} />

        {/* USER */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/dashboard" element={<UserDashboard />} />

        {/* BUDDY */}
        <Route path="/buddy/login" element={<BuddyLogin />} />
        <Route path="/buddy/register" element={<BuddyRegister />} />
        <Route path="/buddy/dashboard" element={<BuddyDashboard />} />

        {/* CREATE NEW TASK */}
        <Route path="/create-task" element={<CreateNewTask />} />
        <Route path="/payment" element={<Payment />} />


        {/* ADMIN */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
