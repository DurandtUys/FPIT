import styles from './index.module.css';

/* eslint-disable-next-line */
export interface LogoutProps {}
import { useRouter } from 'next/router';

export async function getServerSideProps(context) {

  return {
    props: {
    },
  };
}

export function Logout(props: LogoutProps) {
  const signOut = async() => {
    const response = await fetch('./api/logout');
  }

  signOut();
  const router = useRouter();
  setTimeout(function () {
    router.push('/login');
  }, 100);
  return(
    <div>Hello world!</div>
  )
}

export default Logout;
