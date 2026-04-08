import { useState } from "react";
import {
  FaHome,
  FaTasks,
  FaPlus,
  FaMoneyBill,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { label: "Dashboard",      icon: <FaHome />,           path: "/dashboard"   },
  { label: "My Tasks",       icon: <FaTasks />,          path: "/tasks"       },
  { label: "Create Task",    icon: <FaPlus />,           path: "/create-task" },
  { label: "Payments",       icon: <FaMoneyBill />,      path: "/payment"     },
  { label: "Help & Support", icon: <FaQuestionCircle />, path: "/help"        },
];

const Menu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("Dashboard");

  const handleClick = (item) => {
    setActiveItem(item.label);
    if (item.path) navigate(item.path);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] w-56 md:w-60
          bg-white border-r border-gray-100 z-50
          transform transition-transform duration-300 flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Nav items */}
        <ul className="flex-1 px-3 py-4 space-y-0.5">
          {menuItems.map((item) => (
            <li
              key={item.label}
              onClick={() => handleClick(item)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer
                transition-all duration-200 text-sm font-medium
                ${
                  activeItem === item.label
                    ? "bg-gradient-to-r from-[#6A2AFF] to-[#D116A8] text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100 hover:text-[#6A2AFF]"
                }
              `}
            >
              <span className={`text-base ${activeItem === item.label ? "text-white" : "text-gray-400"}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
          >
            <FaSignOutAlt className="text-base" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Menu;