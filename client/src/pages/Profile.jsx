// export default Profile;
import React, { useEffect, useState } from 'react';
import { fetchProfile, updateProfile } from '../utils/api';

const Profile = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data } = await fetchProfile(); // Fetch profile data
        setFormData(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      }
    };
    getProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData); // Update profile data
      setSuccess(true);
      setError('');
    } catch (err) {
      setSuccess(false);
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <h1>Profile</h1>
      <div>
        <label>First Name:</label>
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Enter first name"
        />
      </div>
      <div>
        <label>Last Name:</label>
        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Enter last name"
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
        />
      </div>
      <button type="submit">Update Profile</button>
      {success && <p>Profile updated successfully!</p>}
    </form>
  );
};

export default Profile;
