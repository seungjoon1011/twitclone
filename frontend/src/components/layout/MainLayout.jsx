const MainLayout = ({ children, className = "" }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className={`max-w-[600px] w-full relative bg-white ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default MainLayout;