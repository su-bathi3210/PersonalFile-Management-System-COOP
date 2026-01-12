import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./NavBar.css";
import Logo from "../../Assets/DCDLogo.png";
import api from "../../API/Axios";

export default function AdminNavBar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0].toUpperCase())
            .join("")
            .slice(0, 2);
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const res = await api.get("/employee/auth/profile");
                    setUser(res.data);
                } catch (err) {
                    console.error("Failed to fetch user profile", err);
                }
            }
        };
        fetchUserProfile();
    }, []);

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
                        {getInitials(user?.name)}
                    </div>
                    <span className="username">
                        {user?.name || "Loading..."}
                    </span>
                </div>
            </div>
        </div>
    );
}