import { FiHome, FiSearch, FiPlus, FiBell } from "react-icons/fi";
import Avatar from "../common/Avatar";

const BottomNavigation = ({ activeTab, onTabChange, onCreatePost, user }) => {
  const navItems = [
    { id: "home", icon: FiHome, label: "Home" },
    { id: "search", icon: FiSearch, label: "Search" },
    { id: "create", icon: FiPlus, label: "Create", size: 28 },
    { id: "notifications", icon: FiBell, label: "Notifications" },
  ];

  return (
    <nav className="bg-white border-t border-gray-300 fixed bottom-0 w-full max-w-[600px] z-40">
      <div className="flex items-center justify-around py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.id === "create") {
            return (
              <button
                key={item.id}
                onClick={onCreatePost}
                className="text-gray-700 hover:text-black transition-colors"
                aria-label={item.label}
              >
                <Icon size={item.size || 24} />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`transition-colors ${
                isActive ? "text-black" : "text-gray-500"
              }`}
              aria-label={item.label}
            >
              <Icon size={24} />
            </button>
          );
        })}

        <button
          onClick={() => onTabChange("profile")}
          className={`transition-colors ${
            activeTab === "profile" ? "text-black" : "text-gray-500"
          }`}
          aria-label="Profile"
        >
          <Avatar
            user={user}
            size="extra-small"
            showBorder={activeTab === "profile"}
            borderColor="black"
          />
        </button>
      </div>
    </nav>
  );
};

export default BottomNavigation;