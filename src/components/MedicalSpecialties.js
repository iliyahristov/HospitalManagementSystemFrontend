import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';

function MedicalSpecialties() {
    const [specialties, setSpecialties] = useState([]);
    const [formData, setFormData] = useState({});
    const [dialogVisible, setDialogVisible] = useState(false);
    const toast = React.useRef(null);
    const API_BASE_URL = 'http://localhost:5000/api';

    useEffect(() => {
        fetchSpecialties();
    }, []);

    const fetchSpecialties = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/medicalSpecialties`);
            setSpecialties(response.data.$values || []);
        } catch (error) {
            showError('Error fetching medical specialties');
        }
    };

    const saveSpecialty = async () => {
        try {
            if (formData.specialtyID) {
                await axios.put(`${API_BASE_URL}/medicalSpecialties/${formData.specialtyID}`, formData);
                showSuccess('Specialty updated successfully');
            } else {
                await axios.post(`${API_BASE_URL}/medicalSpecialties`, formData);
                showSuccess('Specialty created successfully');
            }
            fetchSpecialties();
            setDialogVisible(false);
        } catch (error) {
            showError('Error saving specialty');
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
            <h1>Медицински Отделение</h1>
            <Button label="Добави Отделение" icon="pi pi-plus" onClick={() => { setFormData({}); setDialogVisible(true); }} />
            <DataTable value={specialties} paginator rows={10} selectionMode="single" rowKey="specialtyID">
                <Column field="specialtyID" header="ID" />
                <Column field="specialtyName" header="Име на Отделението" />
                <Column header="Действия" body={(rowData) => (
                    <>
                        <Button icon="pi pi-pencil" onClick={() => { setFormData(rowData); setDialogVisible(true); }} />
                    </>
                )} />
            </DataTable>

            <Dialog visible={dialogVisible} onHide={() => setDialogVisible(false)} header="Детайли за Отделение">
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="specialtyName">Име на Отделението</label>
                        <InputText
                            id="specialtyName"
                            value={formData.specialtyName || ''}
                            onChange={(e) => setFormData({ ...formData, specialtyName: e.target.value })}
                        />
                    </div>
                </div>
                <Button label="Запази" icon="pi pi-check" onClick={saveSpecialty} />
            </Dialog>
        </div>
    );
}

export default MedicalSpecialties;