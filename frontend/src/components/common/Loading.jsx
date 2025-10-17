const Loading = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-b-2",
    lg: "h-12 w-12 border-b-2",
  };

  return (
    <div className={`text-center py-8 ${className}`}>
      <div
        className={`animate-spin rounded-full border-blue-500 mx-auto ${sizeClasses[size]}`}
      />
    </div>
  );
};

export default Loading;