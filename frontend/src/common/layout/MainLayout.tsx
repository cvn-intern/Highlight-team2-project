import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen bg-[var(--bg-color)] select-none">{children}</div>
  );
};

export default MainLayout;
