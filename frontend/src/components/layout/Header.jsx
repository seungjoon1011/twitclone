import { FiPlus, FiLogOut } from "react-icons/fi";

const Header = ({ onCreatePost, onLogout }) => {
  return (
    <header className="border-divider fixed top-0 max-w-[600px] w-full z-40 bg-white">
      <div className="card-header">
        <h1 className="text-3xl text-brand">
          Twitter
        </h1>
        <div className="flex items-center space-x-4">
          {onCreatePost && (
            <button
              className="btn-icon-text"
              onClick={onCreatePost}
              aria-label="Create post"
            >
              <FiPlus size={24} />
            </button>
          )}
          {onLogout && (
            <button
              onClick={onLogout}
              className="text-gray-700 hover:text-red-500 transition-colors"
              title="Logout"
              aria-label="Logout"
            >
              <FiLogOut size={24} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;