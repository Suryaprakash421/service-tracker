import React from "react";

const JobLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="">
      <h1>Create New Job</h1>
      <main className="mt-4">{children}</main>
    </div>
  );
};

export default JobLayout;
