import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./NavBar.css";
import Logo from "../../Assets/DCDLogo.png";

export default function NavBar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <div className="header">
            <div className="header-left">
                <Link to="/EmployeeDashboard">
                    <img src={Logo} alt="Left Logo" className="logo" />
                </Link>
                <div>
                    <h1>Department of Cooperative Development - Sri Lanka</h1>
                    <p>Central Province</p>
                </div>
            </div>

            <div className="header-right">
                <div className="user-profile" onClick={handleLogout} style={{ cursor: "pointer" }}>
                    <div className="avatar-circle">
                        A
                    </div>
                    <span className="username">
                        Admin
                    </span>
                </div>
            </div>
        </div>
    );
}