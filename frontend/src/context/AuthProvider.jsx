import React, { createContext, useState, useEffect } from 'react';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [share, setShare] = useState('Share all components');
    return (
        <AuthContext.Provider
            value={{
                share
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;