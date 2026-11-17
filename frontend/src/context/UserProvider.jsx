import { createContext, useContext, useEffect, useState } from 'react'
import { useCurrentUser } from 'hooks/user';

export const UserContext = createContext(null);

function UserProvider({ children }) {
    const [user, setUser] = useState(undefined);
    const { data, isPending, isSuccess, isError, error } = useCurrentUser();

    useEffect(() => {
        if (data !== undefined) {
            setUser(data);
        }
    }, [data]);

    const value = { user, setUser, isPending, isSuccess, isError, error };
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider