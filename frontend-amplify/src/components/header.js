import React from 'react';
import Logo from "../images/logo.png"; 

const Header = ({ onSignOut }) => {
    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
            <img src={Logo} alt="Logo" className="h-12 w-auto" />
            <button 
                onClick={onSignOut}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Log Out
            </button>
        </header>
    );
};

export default Header;
