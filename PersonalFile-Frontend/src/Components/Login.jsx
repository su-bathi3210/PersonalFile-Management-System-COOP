import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../API/Axios";
import "../App.css";

export default function Login() {
    const [view, setView] = useState("employee-request");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    };

    const routeUserByRole = (token) => {
        const decoded = parseJwt(token);
        const role = decoded?.role;

        if (role === "ROLE_ADMIN") {
            navigate("/AdminDashboard");
        } else if (role === "ROLE_EMPLOYEE") {
            navigate("/EmployeeDashboard");
        } else {
            alert("Unauthorized Role Detected");
        }
    };

    const handleRequestOtp = async () => {
        try {
            await api.post(`/employee/auth/request-otp?email=${email}`);
            alert("OTP Sent To Your Email");
            setView("employee-verify");
        } catch (err) {
            alert(err.response?.data?.error || "Email Not Registered");
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const res = await api.post(`/employee/auth/verify-otp?email=${email}&otp=${otp}`);
            const token = res.data.token;
            localStorage.setItem("token", token);
            alert("Employee Login Success");
            routeUserByRole(token);
        } catch (err) {
            alert("Invalid Or Expired OTP");
        }
    };

    const handleAdminLogin = async () => {
        try {
            const res = await api.post("/admin/auth/login", { username, password });
            const token = res.data.token;
            localStorage.setItem("token", token);
            alert("Admin Login Success");
            routeUserByRole(token);
        } catch (err) {
            alert("Invalid Admin Credentials");
        }
    };

    return (
        <div className="login-container">
            <div className="bg"></div>
            <div className="bg bg2"></div>
            <div className="bg bg3"></div>

            <div className="login-box">
                <h1>Department of Cooperative Development</h1>
                <h2>Welcome Back !</h2>
                <h3>Sign In To Continue To Your Account</h3>

                {view === "employee-request" && (
                    <div className="form-content">
                        <input
                            placeholder="ENTER YOUR EMAIL"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button onClick={handleRequestOtp}>REQUEST OTP (BUTTON)</button>
                        <p className="toggle-link" onClick={() => setView("admin-login")}>
                            AS A ADMIN CLICK THIS LOGIN
                        </p>
                    </div>
                )}

                {view === "employee-verify" && (
                    <div className="form-content">
                        <p className="verifying">Verifying: {email}</p>
                        <input
                            placeholder="ENTER OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <button onClick={handleVerifyOtp}>VERIFY</button>
                        <p className="toggle-link" onClick={() => setView("employee-request")}>
                            BACK TO EMAIL
                        </p>
                    </div>
                )}

                {view === "admin-login" && (
                    <div className="form-content">
                        <input
                            placeholder="ENTER YOUR USERNAME"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="ENTER YOUR PASSWORD"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button onClick={handleAdminLogin}>LOGIN</button>
                        <p className="toggle-link" onClick={() => setView("employee-request")}>
                            AS A EMPLOYEE CLICK THIS LOGIN
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}