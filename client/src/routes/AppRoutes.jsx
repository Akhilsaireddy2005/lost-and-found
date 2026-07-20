import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import LostItems from "../pages/lost/LostItems";
import FoundItems from "../pages/found/FoundItems";
import ClaimRequests from "../pages/claims/ClaimRequests";
import Profile from "../pages/profile/Profile";
import NotFound from "../pages/NotFound";
import CreateLostItem from "../pages/lost/CreateLostItem";
import PrivateRoute from "../components/common/PrivateRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/lost-items"
          element={
            <PrivateRoute>
              <LostItems />
            </PrivateRoute>
          }
        />
        <Route
          path="/lost-items/create"
          element={
            <PrivateRoute>
              <CreateLostItem />
            </PrivateRoute>
          }
        />
        <Route
          path="/found-items"
          element={
            <PrivateRoute>
              <FoundItems />
            </PrivateRoute>
          }
        />

        <Route
          path="/claims"
          element={
            <PrivateRoute>
              <ClaimRequests />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;