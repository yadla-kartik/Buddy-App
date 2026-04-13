import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserLogin from "./pages/auth/UserLogin";
import UserRegister from "./pages/auth/UserRegister";
import UserDashboard from "./pages/user/UserDashboard";
import RootRedirect from "./pages/RootRedirect";

import BuddyLogin from "./pages/buddy/BuddyLogin";
import BuddySignup from "./pages/buddy/BuddySignup";
import BuddyRegister from "./pages/buddy/BuddyRegister";
import BuddyDashboard from "./pages/buddy/BuddyDashboard";
import BuddyProfile from "./pages/buddy/Buddyprofile";
import MyTasks from "./pages/buddy/MyTasks";

import CreateNewTask from "./pages/user/CreateNewTask";
import Tasks from "./pages/user/Tasks";
import Payment from "./pages/Payment";
import Profile from "./pages/user/Userprofile";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<RootRedirect />} />

        {/* USER — Layout ke andar (Navbar + Menu constant) */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* FULL SCREEN — Layout ke bahar */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/create-task" element={<CreateNewTask />} />

        {/* BUDDY */}
        <Route path="/buddy/login" element={<BuddyLogin />} />
        <Route path="/buddy/signup" element={<BuddySignup />} />
        <Route path="/buddy/register" element={<BuddyRegister />} />
        <Route path="/buddy/dashboard" element={<BuddyDashboard />} />
        <Route path="/buddy/profile" element={<BuddyProfile />} />
        <Route path="/buddy/tasks" element={<MyTasks />} />

        {/* ADMIN */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
