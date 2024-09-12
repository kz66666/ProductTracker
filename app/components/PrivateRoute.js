import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const PrivateRoute = () => {
  // Get the current user from the AuthContext
  const { user } = useAuth

  // If there is no user, redirect to the login page
  if (user === null) {
    return <Navigate to = "/login"></Navigate>
  }
  else {
    // If there is a user, render the child components that are nested within this PrivateRoute
    return <Outlet/>
  }
}

export default PrivateRoute;

