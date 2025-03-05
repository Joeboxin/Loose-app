import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled, { ThemeProvider } from 'styled-components';
import { database } from '@/backend/Firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useStateContext } from '@/context/StateContext';

// Light and dark mode themes
const lightTheme = {
  background: '#ffffff',
  text: '#0e131f',
  primary: '#55d59e',
  secondary: '#f5f5f5',
};

const darkTheme = {
  background: '#0e131f',
  text: '#ffffff',
  primary: '#45b88d',
  secondary: '#1a1f2b',
};

const Profile = () => {
  const router = useRouter();
  const { user } = useStateContext();
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    theme: 'light',
    financialData: {
      salary: 0,
      debt: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    const userRef = doc(database, 'users', user.uid);
  
    try {
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfileData({
          name: data.name || '',
          bio: data.bio || '',
          theme: data.theme || 'light',
          financialData: data.financialData || { salary: 0, debt: 0 }, // Fetch financialData
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Handle salary and debt fields (convert to integers)
    if (name === 'salary' || name === 'debt') {
      setProfileData({
        ...profileData,
        financialData: {
          ...profileData.financialData,
          [name]: parseInt(value) || 0,
        },
      });
    } else {
      // Handle other fields (name, bio, etc.)
      setProfileData({ ...profileData, [name]: value });
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const userRef = doc(database, 'users', user.uid);
    try {
      await setDoc(userRef, profileData, { merge: true });
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingText>Loading profile...</LoadingText>;

  return (
    <ThemeProvider theme={profileData.theme === 'light' ? lightTheme : darkTheme}>
      <Container>
        <ProfileWrapper>
          <BackButton onClick={() => router.push('/dashboard')}>← Back</BackButton>
          <Title>Your Profile</Title>
          <ProfileImage>
            <span>{profileData.name ? profileData.name[0].toUpperCase() : 'U'}</span>
          </ProfileImage>
          <Input
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleChange}
            placeholder="Your Name"
          />
          <TextArea
            name="bio"
            value={profileData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
          />
          <Input
            type="number"
            name="salary"
            value={profileData.financialData.salary}
            onChange={handleChange}
            placeholder="Salary"
          />
          <Input
            type="number"
            name="debt"
            value={profileData.financialData.debt}
            onChange={handleChange}
            placeholder="Debt"
          />
          
          <SaveButton onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </SaveButton>
        </ProfileWrapper>
      </Container>
    </ThemeProvider>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  padding: 20px;
`;

const ProfileWrapper = styled.div`
  background: ${({ theme }) => theme.secondary};
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
  width: 100%;
  max-width: 400px;
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  top: 15px;
  left: 15px;
  background: none;
  border: none;
  font-size: 18px;
  color: ${({ theme }) => theme.text};
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;

const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;

const ProfileImage = styled.div`
  width: 80px;
  height: 80px;
  background: ${({ theme }) => theme.primary};
  color: white;
  font-size: 32px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin: 0 auto 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  transition: border 0.3s ease-in-out;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  resize: none;
  height: 100px;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  transition: border 0.3s ease-in-out;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
  }
`;

const SaveButton = styled.button`
  width: 100%;
  padding: 12px;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background 0.3s ease-in-out;

  &:hover {
    background: ${({ theme }) => theme.primary}99;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const LoadingText = styled.p`
  text-align: center;
  font-size: 18px;
  color: ${({ theme }) => theme.text};
`;

export default Profile;