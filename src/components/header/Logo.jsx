import React from 'react'
import { MdOutlineFoodBank } from "react-icons/md";
import { Link } from 'react-router-dom'

const Logo = () => {
    return (
        <h1 className='header__logo'>
            <Link to="/">
                <em><MdOutlineFoodBank /></em>
                <span><div>오늘은</div><br /><i>머먹지?</i></span>
            </Link>
        </h1>
    )
}

export default Logo