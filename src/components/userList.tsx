import { useState, useEffect } from 'react'
import { db } from '@/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'

interface User {
    id: string;
    name: string;
    email: string;
}

const UsersList = () => {

   
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const usersCollectionRef = collection(db, "users");

    const fetchMovies = async () => {
        try {
            const data = await getDocs(usersCollectionRef);
            setUsers(data.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User)));
            setLoading(false);
        } catch (error) {
            console.error("Error fetching user: ", error);
        }
    }


    useEffect(() => {
        fetchMovies();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>userlist dari firebase</h1>
            {
                users.map((user) => (
                    <div key={user.id} className='flex items-center space-x-4 p-4 border-b'>
                        <div>
                            <h2>{user.name}</h2>
                            <p>{user.email}</p>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default UsersList