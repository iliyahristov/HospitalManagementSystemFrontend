import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles.css';

import Doctors from "./components/Doctors";
import NavigationMenu from "./components/NavigationMenu";
import Patients from "./components/Patients";
import MedicalSpecialties from "./components/MedicalSpecialties";

function App() {

    return (
        <Router>
            <NavigationMenu />
            <div className="p-m-4">
                <Routes>
                    <Route path="/doctors" element={<Doctors/>}/>
                    <Route path="/patients" element={<Patients/>}/>
                    <Route path="/medicalSpecialties" element={<MedicalSpecialties/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
