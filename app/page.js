'use client';

import { useAuth } from '@/lib/firebase/AuthContext';
import { useEffect, useState } from 'react';

export default function Home() {
  const { user, signIn, signOut } = useAuth();
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    if (user) {
      setProfilePic(user.photoURL);
    }
  }, [user]);

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      {user ? (
        <div className='flex flex-col items-center gap-2'>
            <img src={profilePic} alt="Profile" className="w-40 rounded-full" />
            <p className="text-center">Welcome {user.displayName}</p>
            <button className="border-blue-600 border-solid text-center border p-2 rounded-sm">Enter BoST Room</button>
            <button onClick={signOut} className="border-blue-600 border-solid text-center border p-2 rounded-sm">Sign out</button>
        </div>
      ) : (
      <button onClick={signIn} className="border-blue-600 border-solid text-center border p-2 rounded-sm">Sign in</button>
      )}
    </div>
  );
}
