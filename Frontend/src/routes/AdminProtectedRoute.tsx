import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ReactNode } from "react";
import { RootState } from "../store/store";

interface Props {
  children: ReactNode;
}

const AdminProtectedRoute = ({ children }: Props) => {
  const { accessToken, authLoaded } = useSelector(
    (state: RootState) => state.adminAuth
  );

  if (!authLoaded) {
    return null;
  }

  if (!accessToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
