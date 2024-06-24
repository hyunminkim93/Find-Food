import React from 'react';
import { MdOutlineFoodBank } from "react-icons/md";
import { Link } from 'react-router-dom';

const Logo = () => {
    return (
        <h1 className='header__logo'>
            <Link to="/">
                <div className="logo-container">
                    <span className="text-before-logo">오늘은</span>
                    <em className="logo-icon"><MdOutlineFoodBank /></em>
                    <span className="text-after-logo">머먹지?</span>
                </div>
            </Link>
        </h1>
    );
}

export default Logo;
