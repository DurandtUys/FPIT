/* eslint-disable react/no-children-prop */
/* eslint-disable @next/next/no-img-element */
import { BiShow, BiHide } from 'react-icons/bi';
import Link from 'next/link';
import { useState, Fragment } from 'react';
import { useRouter } from 'next/router';
import { PrismaClient } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';
/* eslint-disable-next-line */
export interface LoginProps {}
interface Login {
  email: string;
  password: string;
}

enum Errors {
  loginError = 'Invalid email and/or password',
  serverError = 'Internal server error',
}

enum Success {
  login = 'Success, correct credentials',
}

export async function getServerSideProps() 
{

  const prisma = new PrismaClient();
  const users = await prisma.user.findMany()
  let user = JSON.stringify(users);
  user = JSON.parse(user)[0];

  return {props: {user}};
}

export function Login({user}) {
  const [showPassword, setShowPassword] = useState(false);
  const [pass,setPass] = useState("admin");
  const [email,setEmail] = useState("admin");
  const router = useRouter()

  const login = async() =>
  {
    const form = new URLSearchParams();
    form.append('email', email);
    form.append('password', pass);

    const response = await fetch('./api/login',{
      method: 'POST',
      body: form
    })
    
    if(response.status == 200)
    {
      router.push('./')
    }

    if(response.status == 404)
    {
      alert("Database error");
    }
  }

  function setPassword(e:any)
  {
    setPass(e.target.value);
  }

  function setE(e:any)
  {
    setEmail(e.target.value);
  }

  return (
    <div className="grid w-screen h-full min-h-screen p-2 place-content-center bg-base-300/40">
      <div
        className="w-full p-8 transition-all bg-white rounded-md shadow-md md:max-w-sm min-w-fit"
      >
        <div>
          <div className="flex flex-col items-center">
            <img src="/EPI-USE Logo.PNG" className="w-24" alt="logo" />
          </div>
          <div className="mt-6">
            <h1 className="text-lg leadin-7">
              Welcome to the Fresh Produce Inventory Tracker
            </h1>
            <h2 className="mt-2 text-sm text-primary/80">
              Please sing-in to your account and start the adventure.
            </h2>
          </div>
        </div>

        <div className="flex flex-col mt-6 gap-y-4">
          <div className="flex flex-col ">
            <label htmlFor="email" className="text-xs">
              Email
            </label>
            <input
              className={`w-full mt-1 font-light rounded focus:ring-primary focus:outline-none input ring-1  input-sm`}
              type="username"
              onChange={setE}
            />
          </div>
          <div className="relative flex flex-col">
            <label
              htmlFor="password"
              className="text-xs"
            >
              Password
            </label>
            <input
              className={`w-full mt-1 font-light rounded input focus:outline-none ring-1 focus:ring-primary input-sm`}
              type="password"
              onChange={setPassword}
            />
            <div className="absolute cursor-pointer right-2 bottom-4">
              <input
                defaultChecked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                type="checkbox"
                name="showPassword"
                id="showPassword"
                className="absolute inset-0 appearance-none peer focus:pointer-events-auto"
              />
              {showPassword ? <BiHide /> : <BiShow />}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center mt-6">
          <button
          onClick={login}
            className="flex items-center justify-center w-full px-1 py-2 font-light text-white rounded-md cursor-pointer disabled:bg-primary/80 bg-primary hover:bg-primary-focus"
          >
            Sign in
          </button>
          <p className="mt-4 text-sm text-center">
            {"Don't"} have an account yet?
            <Link href="/signup" passHref>
              <span className="cursor-pointer text-secondary">
                {' '}
                Signup now!
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
