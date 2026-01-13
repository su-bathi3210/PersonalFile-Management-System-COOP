import { useEffect, useState } from "react";
import api from "../../API/Axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const [employees, setEmployees] = useState([]);
    const [view, setView] = useState("list");
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // success | error

    const initialFormState = {
        name: "", email: "", phoneNumber: "", designation: "", nic: "",
        address: "", dutyPlace: "", grade: "", salaryScale: "",
        dateOfBirth: "", firstAppointmentDate: "", presentStatusDate: "",
        incrementDate: "", dateOfReceiptGradeI: "", dateOfReceiptGradeII: "",
        dateOfReceiptGradeIII: "", dateOfCompulsoryRetirement: ""
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (view === "list") fetchEmployees();
    }, [view]);

    // ================= FETCH =================
    const fetchEmployees = async () => {
        try {
            const res = await api.get("/admin/employees/all");
            setEmployees(res.data);
        } catch {
            showMessage("Failed to load employees", "error");
        }
    };

    // ================= MESSAGE HANDLER =================
    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => setMessage(""), 3000);
    };

    // ================= FORM =================
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (emp) => {
        const sanitizedData = { ...emp };
        Object.keys(sanitizedData).forEach(k => {
            if (sanitizedData[k] === null) sanitizedData[k] = "";
        });

        setFormData(sanitizedData);
        setCurrentId(emp.id);
        setIsEditing(true);
        setView("form");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/admin/employees/update/${currentId}`, formData);
                showMessage("Employee updated successfully", "success");
            } else {
                await api.post("/admin/employees/add", formData);
                showMessage("Employee added successfully", "success");
            }
            resetForm();
        } catch (err) {
            showMessage(err.response?.data || "Request failed", "error");
        }
    };

    // ================= DELETE =================
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this employee?")) return;

        try {
            await api.delete(`/admin/employees/delete/${id}`);
            showMessage("Employee deleted successfully", "success");
            fetchEmployees();
        } catch (err) {
            showMessage(err.response?.data || "Delete failed", "error");
        }
    };

    // ================= RESET =================
    const resetForm = () => {
        setView("list");
        setIsEditing(false);
        setCurrentId(null);
        setFormData(initialFormState);
        fetchEmployees();
    };


    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto bg-white p-6 rounded shadow-lg">

                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h1 className="text-2xl font-bold text-blue-700">
                        Admin - Employee Management
                    </h1>

                    <div className="space-x-2">
                        <button
                            onClick={() => setView("list")}
                            className={`px-4 py-2 rounded ${view === "list" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                        >
                            List View
                        </button>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setFormData(initialFormState);
                                setView("form");
                            }}
                            className={`px-4 py-2 rounded ${view === "form" && !isEditing ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                        >
                            Add New
                        </button>
                    </div>
                </div>

                {message && (
                    <div
                        className={`mb-4 p-3 rounded border 
                        ${messageType === "success"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-700 border-red-200"}`}
                    >
                        {message}
                    </div>
                )}

                {view === "list" ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-3 border">Name</th>
                                    <th className="p-3 border">NIC</th>
                                    <th className="p-3 border">Designation</th>
                                    <th className="p-3 border text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map(emp => (
                                    <tr key={emp.id} className="hover:bg-gray-50 text-sm">
                                        <td className="p-3 border font-medium">{emp.name}</td>
                                        <td className="p-3 border">{emp.nic}</td>
                                        <td className="p-3 border">{emp.designation}</td>
                                        <td className="p-3 border text-center space-x-4">
                                            <button
                                                onClick={() => handleEdit(emp)}
                                                className="bg-blue-100 text-blue-600 px-3 py-1 rounded"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(emp.id)}
                                                className="bg-red-100 text-red-600 px-3 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded border">
                        <h2 className="text-xl font-bold mb-4 text-gray-700">{isEditing ? "Update Employee Details" : "Register New Employee"}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Personal Info */}
                            <div className="flex flex-col"><label className="text-xs font-bold mb-1">Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="border p-2 rounded" required /></div>

                            <div className="flex flex-col"><label className="text-xs font-bold mb-1">Email (Login ID)</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="border p-2 rounded" required disabled={isEditing} /></div>

                            <div className="flex flex-col"><label className="text-xs font-bold mb-1">NIC Number</label>
                                <input type="text" name="nic" value={formData.nic} onChange={handleInputChange} className="border p-2 rounded" /></div>

                            <div className="flex flex-col"><label className="text-xs font-bold mb-1">Phone Number</label>
                                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="border p-2 rounded" /></div>

                            <div className="flex flex-col md:col-span-2"><label className="text-xs font-bold mb-1">Home Address</label>
                                <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="border p-2 rounded" /></div>

                            {/* Job Details */}
                            <div className="flex flex-col"><label className="text-xs font-bold mb-1">Designation</label>
                                <input type="text" name="designation" value={formData.designation} onChange={handleInputChange} className="border p-2 rounded" /></div>

                            <div className="flex flex-col"><label className="text-xs font-bold mb-1">Duty Place</label>
                                <input type="text" name="dutyPlace" value={formData.dutyPlace} onChange={handleInputChange} className="border p-2 rounded" /></div>

                            <div className="flex flex-col"><label className="text-xs font-bold mb-1">Grade</label>
                                <input type="text" name="grade" value={formData.grade} onChange={handleInputChange} className="border p-2 rounded" /></div>

                            <div className="flex flex-col"><label className="text-xs font-bold mb-1">Salary Scale</label>
                                <input type="text" name="salaryScale" value={formData.salaryScale} onChange={handleInputChange} className="border p-2 rounded" /></div>

                            {/* Important Dates */}
                            <div className="flex flex-col"><label className="text-xs font-bold mb-1">Date of Birth</label>
                                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} className="border p-2 rounded" /></div>

                            <div className="flex flex-col"><label className="text-xs font-bold mb-1">First Appointment Date</label>
                                <input type="date" name="firstAppointmentDate" value={formData.firstAppointmentDate} onChange={handleInputChange} className="border p-2 rounded" /></div>

                            <div className="flex flex-col"><label className="text-xs font-bold mb-1">Increment Date</label>
                                <input type="date" name="incrementDate" value={formData.incrementDate} onChange={handleInputChange} className="border p-2 rounded" /></div>

                            {/* Grade Dates */}
                            <div className="flex flex-col"><label className="text-xs font-bold mb-1">Grade III Receipt Date</label>
                                <input type="date" name="dateOfReceiptGradeIII" value={formData.dateOfReceiptGradeIII} onChange={handleInputChange} className="border p-2 rounded" /></div>

                            <div className="flex flex-col"><label className="text-xs font-bold mb-1">Grade II Receipt Date</label>
                                <input type="date" name="dateOfReceiptGradeII" value={formData.dateOfReceiptGradeII} onChange={handleInputChange} className="border p-2 rounded" /></div>

                            <div className="flex flex-col"><label className="text-xs font-bold mb-1">Grade I Receipt Date</label>
                                <input type="date" name="dateOfReceiptGradeI" value={formData.dateOfReceiptGradeI} onChange={handleInputChange} className="border p-2 rounded" /></div>

                            <div className="flex flex-col"><label className="text-xs font-bold mb-1 text-red-600">Retirement Date</label>
                                <input type="date" name="dateOfCompulsoryRetirement" value={formData.dateOfCompulsoryRetirement} onChange={handleInputChange} className="border p-2 rounded border-red-200" /></div>
                        </div>

                        <div className="mt-8 flex flex-col gap-2">
                            <button type="submit" className={`w-full py-3 rounded text-white font-bold text-lg shadow-md transition ${isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}>
                                {isEditing ? "CONFIRM & UPDATE RECORD" : "SAVE NEW EMPLOYEE"}
                            </button>
                            <button type="button" onClick={resetForm} className="w-full py-2 text-gray-500 hover:text-gray-700 transition">
                                Cancel and Go Back
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;