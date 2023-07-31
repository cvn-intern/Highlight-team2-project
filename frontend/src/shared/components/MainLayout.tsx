import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      id="main-layout"
      className="min-h-screen overflow-hidden bg-blue-500 flexCenter"
    >
      {children}
    </div>
  );
};

export default MainLayout;
