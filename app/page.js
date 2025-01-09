'use client';

import { useAuth } from '@/lib/firebase/AuthContext';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, doc, setDoc, getDoc, getDocs, query, orderBy, addDoc, limit } from 'firebase/firestore';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Home() {
  const { user, signIn, signOut } = useAuth();
  const [profilePic, setProfilePic] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state


  useEffect(() => {
    if (user) {
      setProfilePic(user.photoURL);
      handleUserLogin(user);
    }
  }, [user]);

  const handleUserLogin = async (user) => {
    const userDocRef = doc(db, 'users', user.email);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // Create a new user document if it doesn't exist
      await setDoc(userDocRef, {
        email: user.email,
        name: user.displayName,
      });
    }

    fetchEntries(user.email);
  };

  const fetchEntries = async (email) => {
    setLoading(true);
    const entriesQuery = query(
      collection(db, 'users', email, 'entries'),
      orderBy('time', 'desc'),
      limit(5)
    );
    const querySnapshot = await getDocs(entriesQuery);
    const entriesList = querySnapshot.docs.map(doc => doc.data());
    setEntries(entriesList);
    setLoading(false);
  };

  const handleEnterBoSTRoom = async () => {
    const email = user.email;
    const entriesQuery = query(
      collection(db, 'users', email, 'entries'),
      orderBy('time', 'desc'),
      limit(1)
    );
    const querySnapshot = await getDocs(entriesQuery);
    const latestEntry = querySnapshot.docs[0]?.data();

    if (latestEntry) {
      const lastEntryTime = latestEntry.time.toDate();
      const currentTime = new Date();
      const timeDifference = (currentTime - lastEntryTime) / (1000 * 60); // Time difference in minutes

      if (timeDifference < 10) {
        toast('You can only enter the BoST room once every 10 minutes.');
        return;
      }
    }

    // Add a new entry
    const entriesCollectionRef = collection(db, 'users', email, 'entries');
    await addDoc(entriesCollectionRef, {
      time: new Date(),
    });

    toast("Added Entry");
    // Fetch updated entries
    fetchEntries(email);
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      {user ? (
        <div className='flex flex-col items-center gap-2'>
            <img src={profilePic} alt="Profile" className="w-40 rounded-full" />
            <p className="text-center">Welcome {user.displayName}</p>

            <button onClick={handleEnterBoSTRoom} className="border-blue-600 border-solid text-center border p-2 rounded-sm w-40">Enter BoST Room</button>
            <button onClick={signOut} className="border-blue-600 border-solid text-center border p-2 rounded-sm">Sign out</button>

            <Table className='mt-10'>
              <TableHeader>
                <TableRow>
                  <TableHead>Latest Entries</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell>Loading...</TableCell>
                  </TableRow>
                ) : (
                  entries.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{entry.time.toDate().toString().slice(4,-31)}</TableCell>
                    </TableRow>
                  ))
                )}

                {entries.length === 0 && !loading && (
                  <TableRow>
                    <TableCell>No entries found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
        </div>
      ) : (
      <button onClick={signIn} className="border-blue-600 border-solid text-center border p-2 rounded-sm">Sign in</button>
      )}
    </div>
  );
}