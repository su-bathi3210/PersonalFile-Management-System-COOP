import {
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";

import Login from "./Components/Login";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import EmployeeDashboard from "./Components/Employee/EmployeeDashboard";
import AddEmployee from "./Components/Admin/AddEmployee";
import NavBar from "./Components/NavBar/NavBar";

function AppContent() {
  const location = useLocation();

  // Hide navbar on login page
  const hideNavbar = location.pathname === "/";

  return (
    <>
      {!hideNavbar && <NavBar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/EmployeeDashboard" element={<EmployeeDashboard />} />
        <Route path="/AddEmployee" element={<AddEmployee />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default AppContent;
