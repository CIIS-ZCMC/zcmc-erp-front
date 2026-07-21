import React from "react";
import ItemRequestsTable from "./ItemRequestsTable";

export default function ApprovedRequests() {
  return <ItemRequestsTable status="approved" showActions={false} />;
}
