import JobListTable from "@/components/JobListTable";
import React from "react";

function Jobs() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <JobListTable />
    </div>
  );
}

export default Jobs;
