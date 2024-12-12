import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {Toast} from "primereact/toast";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {Calendar} from "primereact/calendar";

function Patients() {
    const [patients, setPatients] = useState([]);
    const [examinations, setExaminations] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [examinationsDialogVisible, setExaminationsDialogVisible] = useState(false);
    const [formData, setFormData] = useState({});
    const toast = React.useRef(null);
    const API_BASE_URL = 'http://localhost:5000/api';

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/Patients`);
            setPatients(response.data.$values);
        } catch (error) {
            showError('Error fetching patients');
        }
    };


    const savePatient = async () => {
        try {
            if (formData.patientID) {
                await axios.put(`${API_BASE_URL}/patients/${formData.patientID}`, formData);
                showSuccess('Patient updated successfully');
            } else {
                await axios.post(`${API_BASE_URL}/patients`, formData);
                showSuccess('Patient created successfully');
            }
            fetchPatients();
            setDialogVisible(false);
        } catch (error) {
            showError('Error saving patient');
        }
    };

    const fetchExaminations = async (patientID) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/examinations`);
            const patientExaminations = response.data.$values.filter((exam) => exam.patientID === patientID);

            const enrichedExaminations = await Promise.all(
                patientExaminations.map(async (exam) => {
                    const doctorResponse = await axios.get(`${API_BASE_URL}/doctors/${exam.doctorID}`);
                    return {
                        ...exam,
                        doctorName: `${doctorResponse.data.firstName} ${doctorResponse.data.lastName}`,
                    };
                })
            );

            setExaminations(enrichedExaminations);
            setExaminationsDialogVisible(true);
        } catch (error) {
            showError('Error fetching examinations');
        }
    };

    const confirmDeletePatient = (patient) => {
        setSelectedPatient(patient);
        setDeleteDialogVisible(true);
    };

    const deletePatient = async () => {
        try {
            await axios.delete(`${API_BASE_URL}/patients/${selectedPatient.patientID}`);
            showSuccess('Patient deleted successfully');
            fetchPatients();
            setDeleteDialogVisible(false);
        } catch (error) {
            showError('Error deleting patient');
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
            <h1>Пациенти</h1>
            <Button label="Добави Пациент" icon="pi pi-plus" onClick={() => { setFormData({}); setDialogVisible(true); }} />
            <DataTable value={patients} paginator rows={10} selectionMode="single">
                <Column field="patientID" header="ID" />
                <Column field="firstName" header="Име" />
                <Column field="lastName" header="Фамилия" />
                <Column field="gender" header="Пол" />
                <Column field="dateOfBirth" header="Рожденна дата" />
                <Column header="Опции" body={(rowData) => (
                    <>
                        <Button icon="pi pi-pencil" onClick={() => { setFormData(rowData); setDialogVisible(true); }} />
                        <Button icon="pi pi-trash" className="p-button-danger" onClick={() => confirmDeletePatient(rowData)} />
                        <Button icon="pi pi-eye" className="p-button-info" onClick={() => fetchExaminations(rowData.patientID)} />
                    </>
                )} />
            </DataTable>

            <Dialog visible={dialogVisible} onHide={() => setDialogVisible(false)} header="Детайли за пациент">
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="firstName">Име</label>
                        <InputText id="firstName" value={formData.firstName || ''}
                                   onChange={(e) => setFormData({...formData, firstName: e.target.value})}/>
                    </div>
                    <div className="p-field">
                        <label htmlFor="lastName">Фамилия</label>
                        <InputText id="lastName" value={formData.lastName || ''}
                                   onChange={(e) => setFormData({...formData, lastName: e.target.value})}/>
                    </div>
                    <div className="p-field">
                        <label htmlFor="gender">Пол</label>
                        <InputText id="gender" value={formData.gender || ''}
                                   onChange={(e) => setFormData({...formData, gender: e.target.value})}/>
                    </div>
                    <div className="p-field">
                        <label htmlFor="dateOfBirth">Рожденна дата</label>
                        <Calendar id="dateOfBirth" value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
                                  onChange={(e) => setFormData({...formData, dateOfBirth: e.value.toISOString()})}  selectionMode="single"/>
                    </div>
                    <div className="p-field">
                        <label htmlFor="contactNumber">Телефон</label>
                        <InputText id="contactNumber" value={formData.contactNumber || ''}
                                   onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}/>
                    </div>
                    <div className="p-field">
                        <label htmlFor="address">Адрес</label>
                        <InputText id="address" value={formData.address || ''}
                                   onChange={(e) => setFormData({...formData, address: e.target.value})}/>
                    </div>
                </div>
                <Button label="Save" icon="pi pi-check" onClick={savePatient}/>
            </Dialog>

            <Dialog visible={examinationsDialogVisible} onHide={() => setExaminationsDialogVisible(false)} header="Прегледи">
                <DataTable value={examinations} paginator rows={5}>
                    <Column field="examinationDate" header="Дата на преглед" />
                    <Column field="doctorName" header="Лекар" />
                    <Column field="diagnosis" header="Диагноза" />
                    <Column field="prescription" header="Предписание" />
                </DataTable>
                <Button label="Затвори" icon="pi pi-times" onClick={() => setExaminationsDialogVisible(false)} />
            </Dialog>

            <Dialog visible={deleteDialogVisible} onHide={() => setDeleteDialogVisible(false)}
                    header="Потвърдете изтриването">
                <p>Сигурни ли сте, че искате да изтриете пациент <strong>{selectedPatient?.firstName} {selectedPatient?.lastName}</strong>?</p>
                <Button label="Да" icon="pi pi-check" className="p-button-danger" onClick={deletePatient} />
                <Button label="Не" icon="pi pi-times" className="p-button-success" outlined onClick={() => setDeleteDialogVisible(false)} />
            </Dialog>
        </div>
    );
}

export default Patients;
