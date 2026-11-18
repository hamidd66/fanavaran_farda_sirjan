import { createContext, useContext, useEffect, useState } from 'react'
import { useCurrentUser } from 'hooks/user';

export const UserContext = createContext(null);

function UserProvider({ children }) {
    const [user, setUser] = useState(undefined);
    const { data, isPending, isSuccess, isError, error, refetch } = useCurrentUser();

    useEffect(() => {
        if (data !== undefined) {
            setUser(data);
        }
        console.log(data);
    }, [data]);

    const value = { user, setUser, isPending, isSuccess, isError, error, refetch };
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider