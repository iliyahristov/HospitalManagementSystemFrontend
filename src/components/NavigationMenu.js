import React from 'react';
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';

function NavigationMenu() {
    const navigate = useNavigate();

    const items = [
                {
                    label: 'Доктори',
                    icon: 'pi pi-user-md',
                    command: () => navigate('/doctors'), // Навигира към /doctors
                },
                {
                    label: 'Пациенти',
                    icon: 'pi pi-users',
                    command: () => navigate('/patients'), // Навигира към /patients
                },
                {
                    label: 'Отделения',
                    icon: 'pi pi-briefcase',
                    command: () => navigate('/medicalSpecialties'), // Навигира към /medicalSpecialties
                }
    ];

    return (
            <Menubar model={items} orientation="horizontal" breakpoint="960px"
                  className="p-3 surface-0 shadow-2 float-center" style={{borderRadius: '2rem'}}/>
    )

}

export default NavigationMenu;
