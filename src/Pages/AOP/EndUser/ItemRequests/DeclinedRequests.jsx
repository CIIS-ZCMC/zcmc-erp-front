import React from "react";
import ItemRequestsTable from "./ItemRequestsTable";

export default function DeclinedRequests() {
  return <ItemRequestsTable status="declined" showActions={false} />;
}
