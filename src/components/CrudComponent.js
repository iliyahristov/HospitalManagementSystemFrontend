import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import ConfirmationDialog from './ConfirmationDialog';
import { fetchItems, saveItem, deleteItem } from '../services/api';

function CrudComponent({ resource }) {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [formData, setFormData] = useState({});
    const toast = React.useRef(null);

    useEffect(() => {
        fetchResourceItems();
    }, []);

    const fetchResourceItems = async () => {
        try {
            const data = await fetchItems(resource);
            setItems(data);
        } catch (error) {
            showError('Error fetching data');
        }
    };

    const saveResourceItem = async () => {
        try {
            await saveItem(resource, formData);
            showSuccess('Saved successfully');
            fetchResourceItems();
            setDialogVisible(false);
        } catch (error) {
            showError('Error saving data');
        }
    };

    const confirmDeleteItem = async () => {
        try {
            await deleteItem(resource, selectedItem.id);
            showSuccess('Deleted successfully');
            fetchResourceItems();
            setDeleteDialogVisible(false);
        } catch (error) {
            showError('Error deleting data');
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
            <h1>{resource.charAt(0).toUpperCase() + resource.slice(1)}</h1>
            <Button label="New" icon="pi pi-plus" onClick={() => { setFormData({}); setDialogVisible(true); }} />
            <DataTable value={items} paginator rows={10} selectionMode="single" onSelectionChange={(e) => setSelectedItem(e.value)}>
                <Column field="id" header="ID" />
                <Column field="name" header="Name" />
                <Column header="Actions" body={(rowData) => (
                    <>
                        <Button icon="pi pi-pencil" onClick={() => { setFormData(rowData); setDialogVisible(true); }} />
                        <Button icon="pi pi-trash" className="p-button-danger" onClick={() => { setSelectedItem(rowData); setDeleteDialogVisible(true); }} />
                    </>
                )} />
            </DataTable>

            <Dialog visible={dialogVisible} onHide={() => setDialogVisible(false)} header="Edit Item">
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="name">Name</label>
                        <InputText id="name" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                </div>
                <Button label="Save" icon="pi pi-check" onClick={saveResourceItem} />
            </Dialog>

            <ConfirmationDialog
                visible={deleteDialogVisible}
                onHide={() => setDeleteDialogVisible(false)}
                onConfirm={confirmDeleteItem}
                message="Are you sure you want to delete this item?"
            />
        </div>
    );
}

export default CrudComponent;
