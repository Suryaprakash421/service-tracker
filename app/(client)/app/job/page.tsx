import JobListTable from "@/components/JobListTable";
import React from "react";

function Jobs() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Jobs</h2>
      </div>
      <JobListTable />
    </div>
  );
}

export default Jobs;
