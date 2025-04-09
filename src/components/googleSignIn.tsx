import React from 'react'
import { signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, googleProvider } from '@/firebaseConfig';

const SigninGoogle = () => {
    const router = useRouter();

    const handleSigninGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            router.push('/');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <button className='bg-red-500 text-white p-2 rounded w-full' onClick={handleSigninGoogle}>SigninGoogle</button>
    )
}

export default SigninGoogle