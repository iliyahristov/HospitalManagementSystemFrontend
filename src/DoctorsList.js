import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const DoctorsList = () => {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        axios.get('/api/doctors')
            .then(response => {
                setDoctors(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the doctors!", error);
            });
    }, []);

    return (
        <div>
            <h1>Doctors List</h1>
            <DataTable value={doctors}>
                <Column field="firstName" header="First Name" />
                <Column field="lastName" header="Last Name" />
                <Column field="specialization" header="Specialization" />
            </DataTable>
        </div>
    );
}

export default DoctorsList;
