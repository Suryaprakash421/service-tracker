export const STATUSES = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  SUCCESS: "Success",
  SETTLED: "Settled",
};

export const STATUS_DROPDOWN_OPTIONS = Object.values(STATUSES).map(
  (status) => ({
    label: status,
    value: status,
  })
);

export const getColorForStatus = (status: string) => {
  switch (status) {
    case STATUSES.PENDING:
      return "text-yellow-600";
    case STATUSES.IN_PROGRESS:
      return "text-blue-600";
    case STATUSES.SUCCESS:
      return "text-green-600";
    case STATUSES.SETTLED:
      return "text-gray-600";
    default:
      return "text-muted-foreground";
  }
};
