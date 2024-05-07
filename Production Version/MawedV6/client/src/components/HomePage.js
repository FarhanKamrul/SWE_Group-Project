// filename: src/components/HomePage.js

import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div>
            <h1>Welcome to Mawed</h1>
            <nav>
                <ul>
                    <li><Link to="/register-patient">Register Patient</Link></li>
                    <li><Link to="/login-patient">Login Patient</Link></li>
                    <li><Link to="/register-clinic">Register Clinic</Link></li>
                    <li><Link to="/login-clinic">Login Clinic</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default HomePage;
