import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {Toast} from "primereact/toast";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";

function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [formData, setFormData] = useState({});
    const toast = React.useRef(null);
    const API_BASE_URL = 'http://localhost:5000/api';

    useEffect(() => {
        fetchDoctors();
        fetchSpecialties();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/Doctors`);
            setDoctors(response.data.$values);
        } catch (error) {
            showError('Error fetching doctors');
        }
    };

    const fetchSpecialties = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/medicalSpecialties`);
            setSpecialties(response.data.$values);
        } catch (error) {
            showError('Error fetching specialties');
        }
    };

    const saveDoctor = async () => {
        try {
            if (formData.doctorID) {
                await axios.put(`${API_BASE_URL}/doctors/${formData.doctorID}`, formData);
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
            <h1>Доктори</h1>
            <Button label="Добави доктор" icon="pi pi-plus" onClick={() => { setFormData({}); setDialogVisible(true); }} />
            <DataTable value={doctors} paginator rows={5} selectionMode="single" rowKey="doctorID">
                <Column field="doctorID" header="ID" />
                <Column field="firstName" header="Име" />
                <Column field="lastName" header="Фамилия" />
                <Column field="specialization" header="Отделение" />
                <Column field="contactNumber" header="Телефон" />
                <Column field="email" header="Email" />
                <Column header="Опции" body={(rowData) => (
                    <>
                        <Button icon="pi pi-pencil" onClick={() => { setFormData(rowData); setDialogVisible(true); }} />
                        <Button icon="pi pi-trash" className="p-button-danger" onClick={() => confirmDeleteDoctor(rowData)} />
                    </>
                )} />
            </DataTable>

            <Dialog visible={dialogVisible} onHide={() => setDialogVisible(false)} header="Детайли за доктор">
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="firstName">Име</label>
                        <InputText id="firstName" value={formData.firstName || ''} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="lastName">Фамилия</label>
                        <InputText id="lastName" value={formData.lastName || ''} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="contactNumber">Телефон</label>
                        <InputText id="contactNumber" value={formData.contactNumber || ''} onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="email">Email</label>
                        <InputText id="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="specialization">Отделение</label>
                        <Dropdown id="specialization" value={specialties.find(spec => spec.specialtyName === formData.specialization) || null} options={specialties}
                                  onChange={(e) => setFormData({ ...formData, specialization: e.value.specialtyName })}
                                  optionLabel="specialtyName" />
                    </div>
                </div>
                <Button label="Save" icon="pi pi-check" onClick={saveDoctor} />
            </Dialog>

            <Dialog visible={deleteDialogVisible} onHide={() => setDeleteDialogVisible(false)} header="Потвърдете изтриването">
                <p>Сигурни ли сте, че искате да изтриете др. {selectedDoctor?.firstName} {selectedDoctor?.lastName}?</p>
                <Button label="Да" icon="pi pi-check" className="p-button-danger" onClick={deleteDoctor} />
                <Button label="Не" icon="pi pi-times" className="p-button-success" outlined onClick={() => setDeleteDialogVisible(false)} />
            </Dialog>
        </div>
    );
}

export default Doctors;
