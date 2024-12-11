import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

function ConfirmationDialog({ visible, onHide, onConfirm, message }) {
    return (
        <Dialog visible={visible} onHide={onHide} header="Confirm Action" footer={
            <>
                <Button label="No" icon="pi pi-times" onClick={onHide} className="p-button-text" />
                <Button label="Yes" icon="pi pi-check" onClick={onConfirm} className="p-button-danger" />
            </>
        }>
            <p>{message}</p>
        </Dialog>
    );
}

export default ConfirmationDialog;
