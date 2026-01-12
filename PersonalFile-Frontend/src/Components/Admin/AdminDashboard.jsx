import React, { useState, useEffect } from "react";
import api from "../../API/Axios";

const AdminDashboard = () => {
    const [employees, setEmployees] = useState([]);
    const [view, setView] = useState("list"); // 'list' or 'form'
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [message, setMessage] = useState("");

    const [formData, setFormData] = useState({
        name: "", email: "", phoneNumber: "", designation: "", nic: "",
        address: "", dutyPlace: "", grade: "", salaryScale: "",
        dateOfBirth: "", firstAppointmentDate: "", presentStatusDate: "",
        incrementDate: "", dateOfReceiptGradeI: "", dateOfReceiptGradeII: "",
        dateOfReceiptGradeIII: "", dateOfCompulsoryRetirement: ""
    });

    useEffect(() => {
        if (view === "list") fetchEmployees();
    }, [view]);

    const fetchEmployees = async () => {
        try {
            const res = await api.get("/admin/employees/all");
            setEmployees(res.data);
        } catch (err) {
            console.error("Error fetching employees", err);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (emp) => {
        setFormData(emp);
        setCurrentId(emp.id);
        setIsEditing(true);
        setView("form");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/admin/employees/update/${currentId}`, formData);
                setMessage("Employee updated successfully!");
            } else {
                await api.post("/admin/employees/add", formData);
                setMessage("Employee added successfully!");
            }
            resetForm();
        } catch (err) {
            setMessage(err.response?.data || "Error processing request");
        }
    };

    const resetForm = () => {
        setView("list");
        setIsEditing(false);
        setCurrentId(null);
        setFormData({
            name: "", email: "", phoneNumber: "", designation: "", nic: "",
            address: "", dutyPlace: "", grade: "", salaryScale: "",
            dateOfBirth: "", firstAppointmentDate: "", presentStatusDate: "",
            incrementDate: "", dateOfReceiptGradeI: "", dateOfReceiptGradeII: "",
            dateOfReceiptGradeIII: "", dateOfCompulsoryRetirement: ""
        });
        fetchEmployees();
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            try {
                await api.delete(`/admin/employees/delete/${id}`);
                fetchEmployees();
            } catch (err) {
                alert("Error deleting employee");
            }
        }
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-blue-700">Admin - Employee Management</h1>
                    <div className="space-x-2">
                        <button onClick={() => setView("list")} className={`px-4 py-2 rounded ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>List View</button>
                        <button onClick={() => { setIsEditing(false); setFormData({}); setView("form"); }} className={`px-4 py-2 rounded ${view === 'form' && !isEditing ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Add Employee</button>
                    </div>
                </div>

                {message && <div className="mb-4 p-3 bg-blue-50 text-blue-700 border border-blue-200 rounded">{message}</div>}

                {view === "list" ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-3 border">Name</th>
                                    <th className="p-3 border">Email</th>
                                    <th className="p-3 border">Designation</th>
                                    <th className="p-3 border text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-gray-50">
                                        <td className="p-3 border">{emp.name || "N/A"}</td>
                                        <td className="p-3 border">{emp.email}</td>
                                        <td className="p-3 border">{emp.designation}</td>
                                        <td className="p-3 border text-center space-x-4">
                                            <button onClick={() => handleEdit(emp)} className="text-blue-600 font-semibold">Edit</button>
                                            <button onClick={() => handleDelete(emp.id)} className="text-red-600 font-semibold">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded bg-gray-50">
                        <h2 className="md:col-span-3 text-lg font-bold border-b pb-2">{isEditing ? "Modify Employee Record" : "New Employee Registration"}</h2>

                        <div className="flex flex-col"><label className="text-xs font-bold">Email (Unique ID)</label>
                            <input type="email" name="email" value={formData.email || ""} onChange={handleInputChange} className="border p-2 rounded" required disabled={isEditing} /></div>

                        <div className="flex flex-col"><label className="text-xs font-bold">Full Name</label>
                            <input type="text" name="name" value={formData.name || ""} onChange={handleInputChange} className="border p-2 rounded" required /></div>

                        <div className="flex flex-col"><label className="text-xs font-bold">NIC Number</label>
                            <input type="text" name="nic" value={formData.nic || ""} onChange={handleInputChange} className="border p-2 rounded" /></div>

                        <input type="text" name="designation" value={formData.designation || ""} placeholder="Designation" onChange={handleInputChange} className="border p-2 rounded" />
                        <input type="text" name="dutyPlace" value={formData.dutyPlace || ""} placeholder="Duty Place" onChange={handleInputChange} className="border p-2 rounded" />

                        <div className="flex flex-col"><label className="text-xs">Increment Date</label>
                            <input type="date" name="incrementDate" value={formData.incrementDate || ""} onChange={handleInputChange} className="border p-2 rounded" /></div>

                        <button type="submit" className={`md:col-span-3 py-3 rounded text-white font-bold ${isEditing ? 'bg-blue-600' : 'bg-green-600'}`}>
                            {isEditing ? "Update All Records" : "Save New Employee"}
                        </button>
                        <button type="button" onClick={resetForm} className="md:col-span-3 text-center text-gray-500 text-sm italic">Cancel and Return to List</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;