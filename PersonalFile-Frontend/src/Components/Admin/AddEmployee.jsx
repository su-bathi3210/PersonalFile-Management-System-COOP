import { useState } from "react";
import api from "../../API/Axios";

export default function AddEmployee() {
    const [email, setEmail] = useState("");


    const addEmployee = async () => {
        try {
            await api.post(`/admin/employees/add?email=${email}`);
            alert("Employee added successfully");
        } catch (err) {
            alert("Unauthorized or employee exists");
        }
    };


    return (
        <div>
            <h2>Add Employee</h2>
            <input placeholder="Employee Email" onChange={e => setEmail(e.target.value)} />
            <button onClick={addEmployee}>Add</button>
        </div>
    );
}