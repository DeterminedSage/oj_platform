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
        const res = await axios.get('http://localhost:8080/profile/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(res.data);
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

  const total = userData.questionsSolvedTotal;
  let division = '';
  let imageUrl = '';
  let message = '';

  if (total < 5) {
    division = 'Academy';
    imageUrl = 'https://raw.githubusercontent.com/DeterminedSage/images/refs/heads/main/konohamaru-removebg-preview.png';
    message = `Solve ${5 - total} more question(s) to become a Genin!`;
  } else if (total < 10) {
    division = 'Genin';
    imageUrl = 'https://raw.githubusercontent.com/DeterminedSage/images/refs/heads/main/kiba-removebg-preview.png';
    message = `Solve ${10 - total} more question(s) to become a Chunin!`;
  } else if (total < 20) {
    division = 'Chunin';
    imageUrl = 'https://raw.githubusercontent.com/DeterminedSage/images/refs/heads/main/shikamaru-removebg-preview.png';
    message = `Solve ${20 - total} more question(s) to become a Jonin!`;
  } else {
    division = 'Jonin';
    imageUrl = 'https://raw.githubusercontent.com/DeterminedSage/images/refs/heads/main/kakashi-removebg-preview.png';
    message = 'Practice harder and harder to become the Hokage!';
  }

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg dark:bg-gray-800 text-gray-900 dark:text-white flex flex-col md:flex-row items-start gap-4 md:gap-8">
      
      {/* Text Section */}
      <div className="md:w-2/3 w-full text-left space-y-2">
        <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
          Profile
        </h2>
        <div><span className="font-semibold text-blue-600">Name:</span> {userData.name}</div>
        <div><span className="font-semibold text-blue-600">Email:</span> {userData.email}</div>
        <div><span className="font-semibold text-blue-600">Division:</span> {division}</div>
        <div><span className="font-semibold text-blue-600">Total Questions Solved:</span> {total}</div>
        <div><span className="font-semibold text-blue-600">Easy: </span> {userData.questionsSolvedEasy}</div>
        <div><span className="font-semibold text-blue-600">Medium: </span> {userData.questionsSolvedMedium}</div>
        <div><span className="font-semibold text-blue-600">Hard: </span> {userData.questionsSolvedHard}</div>
        {/* <div><span className="font-semibold text-blue-600">Total Questions Solved:</span> {total}</div> */}
        <div className="mt-4 italic text-yellow-400">{message}</div>
      </div>

      {/* Image Section */}
      <div className="md:w-1/3 w-full flex justify-center md:justify-start">
        <img src={imageUrl} alt={division} className="w-40 h-auto object-contain" />
      </div>
    </div>
  );
}

export default Profile;





