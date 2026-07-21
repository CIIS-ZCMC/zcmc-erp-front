import React from "react";
import ItemRequestsTable from "./ItemRequestsTable";

export default function AllRequests() {
  return <ItemRequestsTable status="all" showActions={false} />;
}
