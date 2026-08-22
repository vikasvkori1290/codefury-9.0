import React from "react";

export const ProtectedRoute = ({ children }) => {
  // Authentication bypassed for testing & building purpose
  return children;
};

export default ProtectedRoute;
