import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './styles.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [formData, setFormData] = useState({});
    const toast = React.useRef(null);

    useEffect(() => {
        fetchDoctors();
        fetchSpecialties();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/Doctors`);
            console.log(response.data);
            setDoctors(response.data.$values);
        } catch (error) {
            showError('Error fetching doctors');
        }
    };

    const fetchSpecialties = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/medicalSpecialties`);
            setSpecialties(response.data);
        } catch (error) {
            showError('Error fetching specialties');
        }
    };

    const saveDoctor = async () => {
        try {
            if (formData.id) {
                await axios.put(`${API_BASE_URL}/doctors/${formData.id}`, formData);
                showSuccess('Doctor updated successfully');
            } else {
                await axios.post(`${API_BASE_URL}/doctors`, formData);
                showSuccess('Doctor created successfully');
            }
            fetchDoctors();
            setDialogVisible(false);
        } catch (error) {
            showError('Error saving doctor');
        }
    };

    const confirmDeleteDoctor = (doctor) => {
        setSelectedDoctor(doctor);
        setDeleteDialogVisible(true);
    };

    const deleteDoctor = async () => {
        try {
            await axios.delete(`${API_BASE_URL}/doctors/${selectedDoctor.doctorID}`);
            showSuccess('Doctor deleted successfully');
            fetchDoctors();
            setDeleteDialogVisible(false);
        } catch (error) {
            showError('Error deleting doctor');
        }
    };

    const showSuccess = (message) => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
    };

    const showError = (message) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
    };

    return (
        <div>
            <Toast ref={toast} />
            <h1>Doctors</h1>
            <Button label="New Doctor" icon="pi pi-plus" onClick={() => { setFormData({}); setDialogVisible(true); }} />
            <DataTable value={doctors} paginator rows={10} selectionMode="single">
                <Column field="id" header="ID" />
                <Column field="firstName" header="First Name" />
                <Column field="lastName" header="Last Name" />
                <Column header="Actions" body={(rowData) => (
                    <>
                        <Button icon="pi pi-pencil" onClick={() => { setFormData(rowData); setDialogVisible(true); }} />
                        <Button icon="pi pi-trash" className="p-button-danger" onClick={() => confirmDeleteDoctor(rowData)} />
                    </>
                )} />
            </DataTable>

            <Dialog visible={dialogVisible} onHide={() => setDialogVisible(false)} header="Doctor Details">
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="firstName">First Name</label>
                        <InputText id="firstName" value={formData.firstName || ''} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="lastName">Last Name</label>
                        <InputText id="lastName" value={formData.lastName || ''} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="contactNumber">Contact Number</label>
                        <InputText id="contactNumber" value={formData.contactNumber || ''} onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="email">Email</label>
                        <InputText id="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="specialization">Specialization</label>
                        <Dropdown id="specialization" value={formData.specialization || ''} options={specialties} onChange={(e) => setFormData({ ...formData, specialization: e.value })} optionLabel="name" />
                    </div>
                </div>
                <Button label="Save" icon="pi pi-check" onClick={saveDoctor} />
            </Dialog>

            <Dialog visible={deleteDialogVisible} onHide={() => setDeleteDialogVisible(false)} header="Confirm Deletion">
                <p>Are you sure you want to delete Dr. {selectedDoctor?.firstName} {selectedDoctor?.lastName}?</p>
                <Button label="Yes" icon="pi pi-check" className="p-button-danger" onClick={deleteDoctor} />
                <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => setDeleteDialogVisible(false)} />
            </Dialog>
        </div>
    );
}

function Patients() {
    // Similar implementation to Doctors but with Examinations logic
    return <div>Patients Page</div>;
}
function App() {
    return (
        <Router>
            <div className="p-m-4">
                <nav>
                    <Link to="/doctors">Doctors</Link> | <Link to="/patients">Patients</Link> | <Link to="/medicalSpecialties">Specialties</Link>
                </nav>
                <Routes>
                    <Route path="/doctors" element={<Doctors />} />
                    <Route path="/patients" element={<Patients />} />
                </Routes>
            </div>
        </Router>
        // <div className="p-m-4">
        //     <CrudComponent resource="doctors" />
        //     <CrudComponent resource="patients" />
        //     <CrudComponent resource="examinations" />
        //     <CrudComponent resource="medicalSpecialties" />
        // </div>
    );
}

export default App;
