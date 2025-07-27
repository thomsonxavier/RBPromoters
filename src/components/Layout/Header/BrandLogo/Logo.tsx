import Image from 'next/image'

const Logo: React.FC = () => {
  return (
    <>
      <Image
     src={'/images/hero/dark-logo.png'}
        alt='logo'
        width={100}
        height={80}
        unoptimized={true}
        className='dark:hidden'
      />
      <Image
        src={'/images/hero/logo1.png'}
        alt='logo'
        width={100}
        height={80}
        unoptimized={true}
        className='dark:block hidden'
      />
    </>
  )
}

export default Logo
