import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useStateContext } from '@/context/StateContext';
import { checkSignInMethods, signUp } from '@/backend/Auth';
import Link from 'next/link';
import Navbar from '@/components/Dashboard/Navbar';
import { addDocument, getDocument, queryDocuments } from '@/backend/Database';

const DatabaseFunctions = async (user) => {
  const collectionName = 'users';
  const documentId = user.uid; // Use the user's UID as the document ID

  // Extract relevant data from the user object
  const data = {
    email: user.email,
    name: user.displayName || '', // Use empty string if displayName is null
    uid: user.uid,
    financialData: [], // Initialize an empty array for financial data
    meta: {
      creationTime: user.metadata.creationTime, // Extract creationTime as a string
      lastSignInTime: user.metadata.lastSignInTime, // Extract lastSignInTime as a string
    },
  };

  try {
    await addDocument(collectionName, documentId, data);
    console.log('User document added/updated successfully');

    // Test getDocument
    const retrievedUser = await getDocument(collectionName, documentId);
    console.log('Retrieved user:', retrievedUser);
  } catch (error) {
    console.error('Error in DatabaseFunctions:', error.message);
  }
};

const Signup = () => {
  const { user, setUser } = useStateContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function validateEmail() {
    const emailRegex = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email) && email.length > 0;
  }

  async function handleSignup() {
    const isValidEmail = await validateEmail();
    console.log('isValidEmail', isValidEmail);
    if (!isValidEmail) {
      alert('Please enter a valid email');
      return;
    }
    try {
      const userCredential = await signUp(email, password);
      console.log('User signed up successfully');
      setUser(userCredential.user); // Set the user in the state
      await DatabaseFunctions(userCredential.user); // Pass the user object
      router.push('/dashboard');
    } catch (err) {
      console.log('Error Signing Up', err);
      if (err.code === 'auth/email-already-in-use') {
        alert('Email is already in use. Please try another email.');
      }
    }
  }

  return (
    <>
      <Navbar />
      <Section>
        <Header>Signup</Header>
        <InputTitle>Email</InputTitle>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <InputTitle>Password</InputTitle>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />

        <UserAgreementText>
          By signing in, you automatically agree to our{' '}
          <UserAgreementSpan href="/legal/terms-of-use" rel="noopener noreferrer" target="_blank">
            Terms of Use
          </UserAgreementSpan>{' '}
          and{' '}
          <UserAgreementSpan href="/legal/privacy-policy" rel="noopener noreferrer" target="_blank">
            Privacy Policy.
          </UserAgreementSpan>
        </UserAgreementText>

        <MainButton onClick={handleSignup}>Signup</MainButton>

        <LoginPrompt>
          Already have an account?{' '}
          <LoginLink href="/auth/login">Log in here</LoginLink>
        </LoginPrompt>
      </Section>
    </>
  );
};

const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px;
`;

const Header = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  font-size: 16px;
  padding: 10px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 300px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const InputTitle = styled.label`
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
`;

const MainButton = styled.button`
  background-color: #55d59e;
  color: #0e131f;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45b88d;
  }
`;

const UserAgreementText = styled.p`
  font-size: 12px;
  color: #666;
  margin-top: 20px;
  margin-bottom: 15px;
  text-align: center;
`;

const UserAgreementSpan = styled(Link)`
  color: #007bff;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
`;

const LoginPrompt = styled.p`
  font-size: 14px;
  color: #666;
  margin-top: 20px;
`;

const LoginLink = styled(Link)`
  color: #55d59e;
  font-weight: 600;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

export default Signup;