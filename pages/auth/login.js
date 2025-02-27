import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useStateContext } from '@/context/StateContext';
import { signIn } from '@/backend/Auth';
import Link from 'next/link';
import Navbar from '@/components/Dashboard/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleLogin() {
    setError(''); // Clear previous errors
    try {
      await signIn(email, password);
      console.log('User logged in successfully');
      router.push('/dashboard'); // Redirect to dashboard after successful login
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const uid = user.uid;
        }
      });// Get the user's UID
    } catch (error) {
      console.error('Login failed:', error.message);
      setError('Invalid email or password. Please try again.'); // Display error message
    }
  }

  return (
    <>
      <Navbar />
      <Section>
        <Header>Login</Header>
        {error && <ErrorMessage>{error}</ErrorMessage>} {/* Display error message */}
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

        <MainButton onClick={handleLogin}>Login</MainButton>

        <LoginPrompt>
          Don't have an account?{' '}
          <LoginLink href="/auth/signup">Sign up here</LoginLink>
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


export default Login;