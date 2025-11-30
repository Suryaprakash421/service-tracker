import React from "react";

const CustomerFormLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="">
      {/* <h1>Create New Customer</h1> */}
      <main className="mt-4 max-w-4xl mx-auto">{children}</main>
    </div>
  );
};

export default CustomerFormLayout;
