import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";

// Lost Items
import LostItems from "../pages/lost/LostItems";
import CreateLostItem from "../pages/lost/CreateLostItem";
import LostItemDetail from "../pages/lost/LostItemDetail";
import EditLostItem from "../pages/lost/EditLostItem";

// Found Items
import FoundItems from "../pages/found/FoundItems";
import CreateFoundItem from "../pages/found/CreateFoundItem";
import FoundItemDetail from "../pages/found/FoundItemDetail";
import EditFoundItem from "../pages/found/EditFoundItem";

// Claims
import ClaimRequests from "../pages/claims/ClaimRequests";

// Profile
import Profile from "../pages/profile/Profile";

// Other
import NotFound from "../pages/NotFound";
import PrivateRoute from "../components/common/PrivateRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Lost Items */}
        <Route path="/lost-items" element={<PrivateRoute><LostItems /></PrivateRoute>} />
        <Route path="/lost-items/create" element={<PrivateRoute><CreateLostItem /></PrivateRoute>} />
        <Route path="/lost-items/:id" element={<PrivateRoute><LostItemDetail /></PrivateRoute>} />
        <Route path="/lost-items/edit/:id" element={<PrivateRoute><EditLostItem /></PrivateRoute>} />

        {/* Found Items */}
        <Route path="/found-items" element={<PrivateRoute><FoundItems /></PrivateRoute>} />
        <Route path="/found-items/create" element={<PrivateRoute><CreateFoundItem /></PrivateRoute>} />
        <Route path="/found-items/:id" element={<PrivateRoute><FoundItemDetail /></PrivateRoute>} />
        <Route path="/found-items/edit/:id" element={<PrivateRoute><EditFoundItem /></PrivateRoute>} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

        {/* Claims */}
        <Route path="/claims" element={<PrivateRoute><ClaimRequests /></PrivateRoute>} />

        {/* Profile */}
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;