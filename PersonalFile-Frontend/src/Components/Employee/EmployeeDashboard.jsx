import React, { useState, useEffect } from "react";
import api from "../../API/Axios";
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
    const [profile, setProfile] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get("/employee/auth/profile");
            setProfile(res.data);
        } catch (err) {
            console.error("Error loading profile", err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            await api.put("/employee/auth/profile/update", profile);
            setMessage("Profile updated successfully!");
            setIsEditing(false);
            fetchProfile();
        } catch (err) {
            setMessage("Error updating profile.");
        }
    };

    if (loading) return <div className="loader">Loading...</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-card">
                <div className="header-section">
                    <h2>Employee Profile Management</h2>
                    <button
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className={isEditing ? "btn-save" : "btn-edit"}
                    >
                        {isEditing ? "Save Changes" : "Edit Personal Info"}
                    </button>
                </div>

                {message && <div className="alert-box">{message}</div>}

                <div className="tables-wrapper">
                    {/* Table 1: Editable Personal Info */}
                    <div className="table-container">
                        <h3 className="table-title">Personal Information</h3>
                        <table className="profile-table">
                            <tbody>
                                <EditableRow label="Full Name" name="name" value={profile.name} isEditing={isEditing} onChange={handleInputChange} />
                                <EditableRow label="Phone" name="phoneNumber" value={profile.phoneNumber} isEditing={isEditing} onChange={handleInputChange} />
                                <EditableRow label="NIC" name="nic" value={profile.nic} isEditing={isEditing} onChange={handleInputChange} />
                                <EditableRow label="Address" name="address" value={profile.address} isEditing={isEditing} onChange={handleInputChange} />
                                <EditableRow label="DOB" name="dateOfBirth" value={profile.dateOfBirth} isEditing={isEditing} onChange={handleInputChange} type="date" />
                            </tbody>
                        </table>
                    </div>

                    {/* Table 2: Read-Only Official Records */}
                    <div className="table-container">
                        <h3 className="table-title">Official Employment Records</h3>
                        <table className="profile-table readonly-table">
                            <tbody>
                                <StaticRow label="Designation" value={profile.designation} />
                                <StaticRow label="Email" value={profile.email} />
                                <StaticRow label="Duty Place" value={profile.dutyPlace} />
                                <StaticRow label="Grade" value={profile.grade} />
                                <StaticRow label="Salary Scale" value={profile.salaryScale} />
                                <StaticRow label="Appointed Date" value={profile.firstAppointmentDate} />
                                <StaticRow label="Retirement" value={profile.dateOfCompulsoryRetirement} />
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EditableRow = ({ label, name, value, isEditing, onChange, type = "text" }) => (
    <tr>
        <td className="label-cell">{label}</td>
        <td className="content-cell">
            {isEditing ? (
                <input type={type} name={name} value={value || ""} onChange={onChange} className="table-input" />
            ) : (
                <span className="value-text">{value || "—"}</span>
            )}
        </td>
    </tr>
);

const StaticRow = ({ label, value }) => (
    <tr>
        <td className="label-cell">{label}</td>
        <td className="content-cell">
            <span className="value-text static">{value || "N/A"}</span>
        </td>
    </tr>
);

export default EmployeeDashboard;