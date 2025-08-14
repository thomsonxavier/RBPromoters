'use client'
import { navLinks } from '@/app/api/navlink'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import { useEffect, useRef, useState, useCallback } from 'react'
import NavLink from './Navigation/NavLink'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { account } from '../../../app/appwrite'

const Header: React.FC = () => {
  const [sticky, setSticky] = useState(false)
  const [navbarOpen, setNavbarOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()

  // User state
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const sideMenuRef = useRef<HTMLDivElement>(null)

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (sideMenuRef.current && !sideMenuRef.current.contains(event.target as Node)) {
      setNavbarOpen(false)
    }
  }

  const handleScroll = useCallback(() => {
    setSticky(window.scrollY >= 50)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleScroll])

  // Auto-redirect to admin dashboard if user is logged in and on signin page
  useEffect(() => {
    if (user && (pathname === '/signin' || pathname === '/signup')) {
      console.log('Redirecting to admin dashboard...', { user: user.name, pathname })
      router.push('/admin/dashboard')
    }
  }, [user, pathname, router])

  const isHomepage = pathname === '/'

  return (
    <header className={`fixed sm:h-14 h-16 py-1 z-50 w-full bg-transparent transition-all duration-300 lg:px-0 px-4 ${sticky ? "top-3" : "top-0"}`}>
      <nav className={`container mx-auto max-h-18 max-w-8xl flex items-center justify-between py-1 duration-300 ${sticky ? "shadow-lg bg-white dark:bg-dark rounded-full top-5 px-4 " : "shadow-none top-0"}`}>
        <div className='flex justify-between items-center gap-2 w-full'>
          <div>
            <Link href='/'>
              <Image
           src={'/images/hero/dark-logo.png'}
                alt='logo'
                width={100}
                height={80}
                unoptimized={true}
                className={`${isHomepage ? sticky ? "block dark:hidden" : "hidden" : sticky ? "block dark:hidden" : "block dark:hidden"}`}
              />
              <Image
           src={'/images/hero/logo1.png'}
                alt='logo'
                width={100}
                height={80}
                unoptimized={true}
                className={`${isHomepage ? sticky ? "hidden dark:block" : "block" : sticky ? "dark:block hidden" : "dark:block hidden"}`}
              />
            </Link>
          </div>
          <div className='flex items-center gap-2 sm:gap-6'>
            <button
              className='hover:cursor-pointer'
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Icon
                icon={'solar:sun-bold'}
                width={32}
                height={32}
                className={`dark:hidden block ${isHomepage
                  ? sticky
                    ? 'text-dark'
                    : 'text-white'
                  : 'text-dark'
                  }`}
              />
              <Icon
                icon={'solar:moon-bold'}
                width={32}
                height={32}
                className='dark:block hidden text-white'
              />
            </button>
                         <div className={`hidden md:block`}>
               <Link href="tel:+918883568814"  className={`text-base text-inherit flex items-center gap-2 border-r pr-6 ${isHomepage
                 ? sticky
                   ? 'text-dark dark:text-white hover:text-primary border-dark dark:border-white'
                   : 'text-white hover:text-primary'
                 : 'text-dark hover:text-primary'
                 }`}
               >
                 <Icon icon={'ph:phone-bold'} width={24} height={24} />
                   +91 88835 68814
               </Link>
             </div>
             
                           {/* Profile Section */}
              <div className={`hidden md:block`}>
                {isLoading && (
                  <span className={`text-sm ${isHomepage
                    ? sticky
                      ? 'text-dark dark:text-white'
                      : 'text-white'
                    : 'text-dark dark:text-white'
                    }`}>
                    Loading...
                  </span>
                )}
                {user && (
                  <button
                    onClick={() => router.push('/admin/dashboard')}
                    className={`text-sm hover:text-primary transition-colors ${isHomepage
                      ? sticky
                        ? 'text-dark dark:text-white hover:text-primary'
                        : 'text-white hover:text-primary'
                      : 'text-dark dark:text-white hover:text-primary'
                      }`}
                  >
                    Welcome, {user.name} (Admin)
                  </button>
                )}
                {!isLoading && !user && (
                  <span className={`text-sm ${isHomepage
                    ? sticky
                      ? 'text-red-500'
                      : 'text-red-300'
                    : 'text-red-500'
                    }`}>
                    Not logged in
                  </span>
                )}
              </div>
            <div>
              <button
                onClick={() => setNavbarOpen(!navbarOpen)}
                className={`flex items-center gap-3 p-2 sm:px-5 sm:py-3 rounded-full font-semibold hover:cursor-pointer border ${isHomepage
                  ? sticky
                    ? 'text-white bg-dark dark:bg-white dark:text-dark dark:hover:text-white dark:hover:bg-dark hover:text-dark hover:bg-white border-dark dark:border-white'
                    : 'text-dark bg-white dark:text-dark hover:bg-transparent hover:text-white border-white'
                  : 'bg-dark text-white hover:bg-transparent hover:text-dark dark:bg-white dark:text-dark dark:hover:bg-transparent dark:hover:text-white duration-300'
                  }`}
                aria-label='Toggle mobile menu'>
                <span>
                  <Icon icon={'ph:list'} width={24} height={24} />
                </span>
                <span className='hidden sm:block'>Menu</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {
        navbarOpen && (
          <div className='fixed top-0 left-0 w-full h-full bg-black/50 z-40' />
        )
      }

      <div
        ref={sideMenuRef}
        className={`fixed top-0 right-0 h-full w-full bg-dark shadow-lg transition-transform duration-300 max-w-2xl ${navbarOpen ? 'translate-x-0' : 'translate-x-full'} z-50 px-20 overflow-auto no-scrollbar`}
      >
        <div className="flex flex-col h-full justify-between">
          <div className="">
            <div className='flex items-center justify-start py-10'>
              <button
                onClick={() => setNavbarOpen(false)}
                aria-label='Close mobile menu'
                className='bg-white p-3 rounded-full hover:cursor-pointer'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'>
                  <path
                    fill='none'
                    stroke='black'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
            <nav className='flex flex-col items-start gap-4'>
              <ul className='w-full'>
                {navLinks.map((item, index) => (
                  <NavLink key={index} item={item} onClick={() => setNavbarOpen(false)} />
                ))}
                {/* <li className='flex items-center gap-4'>
                  <Link href="/signin" className='py-4 px-8 bg-primary text-base leading-4 block w-fit text-white rounded-full border border-primary font-semibold mt-3 hover:bg-transparent hover:text-primary duration-300'>
                    Sign In
                  </Link>
                  <Link href="/" className='py-4 px-8 bg-transparent border border-primary text-base leading-4 block w-fit text-primary rounded-full font-semibold mt-3 hover:bg-primary hover:text-white duration-300'>
                    Sign up
                  </Link>
                </li> */}
              </ul>
            </nav>
          </div>

          <div className='flex flex-col gap-1 my-16 text-white'>
            <p className='text-base sm:text-xm font-normal text-white/40'>
              Contact
            </p>
            <Link href="mailto:rbpromoters@gmail.com" className='text-base sm:text-xm font-medium text-inherit hover:text-primary'>
              rbpromoters@gmail.com
            </Link>
            <Link href="tel:+918883568814" className='text-base sm:text-xm font-medium text-inherit hover:text-primary'>
            +91 88835 68814{' '}
            </Link>
          </div>
        </div>
      </div>
    </header >
  )
}

export default Header
