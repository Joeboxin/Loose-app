import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { logOut } from '@/backend/Auth';
import { useStateContext } from '@/context/StateContext';

const Navbar = () => {
  const { user, setUser } = useStateContext();
  const router = useRouter();

  // Handle logout functionality
  const handleLogout = async () => {
    try {
      await logOut(); // Call the logOut function to log the user out
      setUser(null); // Clear user state
      router.push('/'); // Redirect to the home page
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <Nav>
      <Logo href="/">Loose</Logo>
      <NavLinks>
        {user ? (
          // Display logout when user is signed in
          <>
            <ButtonLink href="/profile">Profile</ButtonLink>
            <Button onClick={handleLogout}>Logout</Button> 
          </>
        ) : (
          // Display sign-up and login when user is NOT signed in
          <>
            <ButtonLink href="/auth/signup">Sign Up</ButtonLink>
            <ButtonLink href="/auth/login">Log In</ButtonLink>
          </>
        )}
      </NavLinks>
    </Nav>
  );
};

// Styled components (unchanged)
const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background-color: #0E131F;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.a`
  font-size: 1.5rem;
  font-weight: 700;
  color: #55D59E;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;


const NavLinks = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const ButtonLink = styled(Link)`
  background-color: #55D59E;
  color: #0E131F;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45b88d;
  }
`;

const Button = styled.button`
  background-color: #55D59E;
  color: #0E131F;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45b88d;
  }
`;

export default Navbar;
