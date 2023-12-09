import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import Logo from "../images/logo.png"; 

const Header = ({ onSignOut }) => {
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await Amplify.Auth.currentAuthenticatedUser();
                setUserEmail(user.attributes.email);
            } catch (error) {
                console.log('error fetching user', error);
            }
        };

        fetchUser();
    }, []);

    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
            <img src={Logo} alt="Logo" className="h-12 w-auto" />
            <div>
                <span className="mr-4">{userEmail}</span>
                <button 
                    onClick={onSignOut}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Log Out
                </button>
            </div>
        </header>
    );
};

export default Header;
