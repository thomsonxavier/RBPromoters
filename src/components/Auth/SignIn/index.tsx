"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import SocialSignIn from "../SocialSignIn";
import toast, { Toaster } from 'react-hot-toast';
import AuthDialogContext from "@/app/context/AuthDialogContext";
import Logo from "@/components/Layout/Header/BrandLogo/Logo";
import { account, ID } from "@/app/appwrite";

const Signin = ({ signInOpen }: { signInOpen?: any }) => {
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const authDialog = useContext(AuthDialogContext);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await account.get();
        setLoggedInUser(user);
      } catch (error) {
        // User is not logged in
        setLoggedInUser(null);
      }
    };
    checkUser();
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const session = await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      setLoggedInUser(user);
      
      // Store session in localStorage for the profile API
      if (typeof window !== 'undefined') {
        localStorage.setItem('appwrite_session', session.$id);
      }
      
      toast.success('Successfully logged in!');
      
      if (signInOpen) {
        setTimeout(() => {
          signInOpen(false);
        }, 1200);
        authDialog?.setIsSuccessDialogOpen(true);
        setTimeout(() => {
          authDialog?.setIsSuccessDialogOpen(false);
        }, 1100);
      } else {
        // Redirect to admin dashboard if user has admin role
        if (user.labels && user.labels.includes('admin')) {
          router.push('/admin/dashboard');
        } else {
          router.push('/');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed');
      toast.error(error.message || 'Login failed');
      authDialog?.setIsFailedDialogOpen(true);
      setTimeout(() => {
        authDialog?.setIsFailedDialogOpen(false);
      }, 1100);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      await account.create(ID.unique(), email, password, name);
      await login(e);
      toast.success('Account created successfully!');
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed');
      toast.error(error.message || 'Registration failed');
      authDialog?.setIsFailedDialogOpen(true);
      setTimeout(() => {
        authDialog?.setIsFailedDialogOpen(false);
      }, 1100);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession("current");
      setLoggedInUser(null);
      
      // Clear session from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('appwrite_session');
      }
      
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  // If user is logged in, show logged in state
  if (loggedInUser) {
    return (
      <>
        <div className="mb-10 text-center flex justify-center">
          <Logo />
        </div>
        
        <div className="text-center">
          <p className="text-lg mb-4">Welcome, {loggedInUser.name || loggedInUser.email}!</p>
          <button
            type="button"
            onClick={logout}
            className="flex w-full cursor-pointer items-center justify-center rounded-2xl border border-red-500 bg-red-500 hover:bg-transparent hover:text-red-500 px-5 py-3 text-base text-white transition duration-300 ease-in-out"
          >
            Logout
          </button>
        </div>
        <Toaster />
      </>
    );
  }

  return (
    <>
      <div className="mb-10 text-center flex justify-center">
        <Logo />
      </div>

      <SocialSignIn />

      <span className="z-1 relative my-8 block text-center">
        <span className="-z-1 absolute left-0 top-1/2 block h-px w-full bg-black/10 dark:bg-white/20"></span>
        <span className="text-body-secondary relative z-10 inline-block bg-white px-3 text-base dark:bg-black">
          OR
        </span>
        <Toaster />
      </span>

      <form onSubmit={isRegistering ? register : login}>
        {isRegistering && (
          <div className="mb-[22px]">
            <input
              type="text"
              placeholder="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border placeholder:text-gray-400 border-black/10 dark:border-white/20 border-solid bg-transparent px-5 py-3 text-base text-dark outline-none transition  focus:border-primary focus-visible:shadow-none dark:border-border_color dark:text-white dark:focus:border-primary"
            />
          </div>
        )}
        
        <div className="mb-[22px]">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border placeholder:text-gray-400 border-black/10 dark:border-white/20 border-solid bg-transparent px-5 py-3 text-base text-dark outline-none transition  focus:border-primary focus-visible:shadow-none dark:border-border_color dark:text-white dark:focus:border-primary"
          />
        </div>
        
        <div className="mb-[22px]">
          <input
            type="password"
            required
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-black/10 dark:border-white/20 border-solid bg-transparent px-5 py-3 text-base text-dark outline-none transition  focus:border-primary focus-visible:shadow-none dark:border-border_color dark:text-white dark:focus:border-primary"
          />
        </div>
        
        {error && (
          <div className="mb-4 text-red-500 text-sm text-center">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full cursor-pointer items-center justify-center rounded-2xl border border-primary bg-primary hover:bg-transparent hover:text-primary px-5 py-3 text-base text-white transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : (isRegistering ? 'Sign Up' : 'Sign In')}
          </button>
        </div>
        
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="flex w-full cursor-pointer items-center justify-center rounded-2xl border border-gray-300 bg-transparent hover:bg-gray-50 px-5 py-3 text-base text-gray-700 transition duration-300 ease-in-out dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {isRegistering ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </button>
        </div>
      </form>

      <div className="text-center">
        <Link
          href="/"
          className="mb-2 text-base text-dark hover:text-primary dark:text-white dark:hover:text-primary"
        >
          Forget Password?
        </Link>
      </div>
      
      <p className="text-body-secondary text-base text-center">
        {isRegistering ? 'Already a member?' : 'Not a member yet?'}{" "}
        <button 
          onClick={() => setIsRegistering(!isRegistering)}
          className="text-primary hover:underline"
        >
          {isRegistering ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
    </>
  );
};

export default Signin;