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
  const [rememberMe, setRememberMe] = useState(false);
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

  // Load saved credentials on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email');
    const savedPassword = localStorage.getItem('remembered_password');
    const savedRememberMe = localStorage.getItem('remember_me');
    
    if (savedRememberMe === 'true' && savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
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
        
        // Set a cookie for middleware to check authentication
        document.cookie = `sessionId=${session.$id}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      }

      // Handle remember me functionality
      if (rememberMe) {
        localStorage.setItem('remembered_email', email);
        localStorage.setItem('remembered_password', password);
        localStorage.setItem('remember_me', 'true');
      } else {
        localStorage.removeItem('remembered_email');
        localStorage.removeItem('remembered_password');
        localStorage.removeItem('remember_me');
      }
      
      toast.success('Successfully logged in!');
      
      // Dispatch custom event to notify header about login state change
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('userLoginStateChange'));
      }
      
      if (signInOpen) {
        setTimeout(() => {
          signInOpen(false);
        }, 1200);
        authDialog?.setIsSuccessDialogOpen(true);
        setTimeout(() => {
          authDialog?.setIsSuccessDialogOpen(false);
        }, 1100);
      } else {
        // Check for redirect parameter in URL
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get('redirect');
        
        console.log('Redirect parameter:', redirectTo);
        console.log('Current URL:', window.location.href);
        
        if (redirectTo) {
          // Decode the redirect URL and navigate to it
          const decodedRedirect = decodeURIComponent(redirectTo);
          console.log('Decoded redirect:', decodedRedirect);
          router.push(decodedRedirect);
        } else {
          // Redirect to admin dashboard if user has admin role
          if (user.labels && user.labels.includes('admin')) {
            console.log('User has admin role, redirecting to dashboard');
            router.push('/admin/dashboard');
          } else {
            console.log('User does not have admin role, redirecting to home');
            router.push('/');
          }
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

  const logout = async () => {
    try {
      await account.deleteSession("current");
      setLoggedInUser(null);
      
      // Clear session from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('appwrite_session');
        
        // Clear the sessionId cookie for middleware
        document.cookie = 'sessionId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
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

      <form onSubmit={login}>
        <div className="mb-[22px]">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border placeholder:text-gray-400 border-black/10 dark:border-white/20 border-solid bg-transparent px-5 py-3 text-base text-dark outline-none transition focus:border-primary focus-visible:shadow-none dark:border-border_color dark:text-white dark:focus:border-primary"
          />
        </div>
        
        <div className="mb-[22px]">
          <input
            type="password"
            required
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-black/10 dark:border-white/20 border-solid bg-transparent px-5 py-3 text-base text-dark outline-none transition focus:border-primary focus-visible:shadow-none dark:border-border_color dark:text-white dark:focus:border-primary"
          />
        </div>

        {/* Remember Me Checkbox */}
        <div className="mb-[22px] flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 text-primary bg-transparent border border-black/10 dark:border-white/20 rounded focus:ring-primary focus:ring-2 dark:focus:ring-primary"
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm text-dark dark:text-white">
            Remember Me
          </label>
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
            {isLoading ? 'Loading...' : 'Sign In'}
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
      
      <Toaster />
    </>
  );
};

export default Signin;