import React from "react";

const MainLayout = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <div
      id="main-layout"
      className={`min-h-screen bg-blue-500 flexCenter ${className}`}
    >
      {children}
    </div>
  );
};

export default MainLayout;
