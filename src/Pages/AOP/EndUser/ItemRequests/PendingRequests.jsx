import React from "react";
import ItemRequestsTable from "./ItemRequestsTable";

export default function PendingRequests() {
  return <ItemRequestsTable status="pending" showActions={true} />;
}
