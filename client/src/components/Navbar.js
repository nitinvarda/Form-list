import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-md bg-dark navbar-dark fixed-top" >

            <Link className="navbar-brand" to="/">Home</Link>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                <span className="navbar-toggler-icon"></span>
            </button>


            <div className="collapse navbar-collapse justify-content-end" id="collapsibleNavbar">
                <ul className="navbar-nav " >

                    <li className="nav-item">
                        <Link to="/" style={{ color: "white", textDecoration: 'none' }} >Form</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/list" style={{ color: "white", textDecoration: 'none' }}>List</Link>
                    </li>

                </ul>
            </div>
        </nav>
    );
}


export default Navbar;
