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
import AdminNavBar from "./Components/NavBar/AdminNavBar";

function App() {
  const location = useLocation();

  const adminRoutes = ["/AdminDashboard", "/AddEmployee"];

  const isAdminPage = adminRoutes.includes(location.pathname);
  const isLoginPage = location.pathname === "/";

  return (
    <>
      {!isLoginPage && !isAdminPage && <NavBar />}

      {isAdminPage && <AdminNavBar />}

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

export default App;
