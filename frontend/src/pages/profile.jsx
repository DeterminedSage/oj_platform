import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setError('User must be logged in to view profile');
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await axios.get('https://your-backend-api.com/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(res.data); // expects { name, email }
      } catch (err) {
        setError('Failed to fetch user details');
      }
    };

    fetchUserData();
  }, [token]);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 text-xl">
        {error}
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-lg">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg dark:bg-gray-800 text-gray-900 dark:text-white">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="space-y-2">
        <div>
          <span className="font-semibold">Name:</span> {userData.name}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {userData.email}
        </div>
      </div>
    </div>
  );
}

export default Profile;

