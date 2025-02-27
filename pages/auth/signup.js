import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useStateContext } from '@/context/StateContext';
import { signUp } from '@/backend/Auth';
import Link from 'next/link';
import Navbar from '@/components/Dashboard/Navbar';
import { addDocument } from '@/backend/Database';

const DatabaseFunctions = async (user) => {
  const collectionName = 'users';
  const documentId = user.uid;

  const data = {
    email: user.email,
    name: user.displayName || '',
    uid: user.uid,
    financialData: [],
    meta: {
      creationTime: user.metadata.creationTime,
      lastSignInTime: user.metadata.lastSignInTime,
    },
  };

  try {
    await addDocument(collectionName, documentId, data);
    console.log('User document added successfully');
  } catch (error) {
    console.error('Error in DatabaseFunctions:', error.message);
  }
};

const Signup = () => {
  const { setUser } = useStateContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const router = useRouter();

  const validateEmail = () => {
    const emailRegex = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = () => {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  };

  const handleSignup = async () => {
    if (!validateEmail()) {
      setErrorMessage('Please enter a valid email.');
      return;
    }

    if (!validatePassword()) {
      setErrorMessage('Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      const userCredential = await signUp(email, password);
      setUser(userCredential.user);
      await DatabaseFunctions(userCredential.user);
      router.push('/dashboard');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setErrorMessage('Email is already in use. Please try another email.');
      } else {
        setErrorMessage('Error signing up. Please try again.');
      }
    }
  };

  return (
    <>
      <Navbar />
      <Section>
        <Header>Signup</Header>

        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

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
          onFocus={() => setShowPasswordPopup(true)}
          onBlur={() => setShowPasswordPopup(false)}
        />

        {showPasswordPopup && (
          <PasswordPopup>
            <p>Password must:</p>
            <ul>
              <li>Be at least 8 characters long</li>
              <li>Contain at least one uppercase letter</li>
              <li>Contain at least one number</li>
            </ul>
          </PasswordPopup>
        )}

        <InputTitle>Confirm Password</InputTitle>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter your password"
        />

        <UserAgreementText>
          By signing in, you agree to our{' '}
          <UserAgreementSpan href="/legal/terms-of-use" target="_blank">Terms of Use</UserAgreementSpan> and{' '}
          <UserAgreementSpan href="/legal/privacy-policy" target="_blank">Privacy Policy</UserAgreementSpan>.
        </UserAgreementText>

        <MainButton onClick={handleSignup}>Signup</MainButton>

        <LoginPrompt>
          Already have an account? <LoginLink href="/auth/login">Log in here</LoginLink>
        </LoginPrompt>
      </Section>
    </>
  );
};

// Styled Components
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

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
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

const PasswordPopup = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  position: absolute;
  max-width: 280px;
  text-align: left;
  font-size: 12px;
  color: #333;
  margin-top: -5px;

  ul {
    padding-left: 20px;
  }

  li {
    margin-bottom: 5px;
  }
`;

export default Signup;
