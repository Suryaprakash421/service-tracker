import React from "react";

const JobLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="">
      <main className="mt-4 max-w-4xl mx-auto">{children}</main>
    </div>
  );
};

export default JobLayout;
