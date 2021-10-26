import React from 'react';
import { NavLink } from 'react-router-dom';
import './style.css';

/**
* @author
* @function Header
**/

export const Header = () => {
    return (
        <header className="header">
                <ul className="leftMenu">
                    <li><NavLink to={'/Login'}>Logi Sisse</NavLink></li>
                    <li><NavLink to={'/Join'}>Liitu üritusega</NavLink></li>
                </ul>
        </header>
    )

}