import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-screen h-screen bg-[var(--bg-color)]">{children}</div>
  );
};

export default MainLayout;
