/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable-next-line */
export interface UserProps {}
import axios from 'axios';
import { BiUser } from 'react-icons/bi';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { CgSpinner } from 'react-icons/cg';
import Swal from 'sweetalert2';
import { PrismaClient } from '@prisma/client';

const profileUrl = `http://localhost:3333/api/profile/getprofile`;

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

export async function getServerSideProps() {

  const prisma = new PrismaClient();

  const data = await(await fetch("http://localhost:3000/api/getsession")).json();
  const id = parseInt(data[0].id);
  
  let response = await prisma.user.findFirst({
      where: { id: id },
      select: {
        Bio: true,
        Name: true,
        Surname: true,
        email: true
      }
    });

  return {
    props: {
      data: response,
      status: "200",
      id:id
    },
  };
}

interface handleUpdateUserProfileProps {
  firstName: string;
  lastName: string;
  bio: string;
}

export function User({ data, status,id}) {
  const [loadingUserProfileUpdate, setLoadingUserProfileUpdate] =
    useState<boolean>(false);

  const [Name,setName] = useState(data.Name); 
  const [Surname,setSName] = useState(data.Surname); 
  const [Bio,setBio] = useState(data.Bio); 

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleUpdateUserProfile = async (
    validatedData: handleUpdateUserProfileProps
  ) => {
    setLoadingUserProfileUpdate(true);
    const params = new URLSearchParams();
    params.append('id', id);
    params.append('Name', Name);
    params.append('Bio', Bio);
    params.append('Surname', Surname);
    const {status} = await axios.post(
      `http://localhost:3000/api/updateUser`,
      params
    );
    
    if (status === 201) {
      Toast.fire({
        icon: 'success',
        title: 'User information updated.',
      });
      data = await(await fetch("http://localhost:3000/api/getsession")).json();
    } else if (status >= 500) {
      Toast.fire({
        icon: 'error',
        title: 'Oops an error has occured.',
      });
    }

    setLoadingUserProfileUpdate(false);
  };

  if (status >= 500)
    return (
      <div className="grid w-full h-screen place-content-center">
        <p className="p-4 text-xl text-red-700 rounded bg-red-500/30">
          ! Ooops. An Error has occured.
        </p>
      </div>
    );

    function setNAME(e)
    {
      setName(e.target.value);
    }

    function setSNAME(e)
    {
      setSName(e.target.value);
    }

    function setBIO(e)
    {
      setBio(e.target.value);
    }

  return (
    <div className="p-4">
      <div className="grid w-full grid-cols-10 mt-4">
        <div className="col-span-10 xl:col-span-2">Peronal Information</div>
        <form
          onSubmit={handleSubmit(handleUpdateUserProfile)}
          className="col-span-full md:col-span-5 xl:col-span-4"
        >
          <div className="flex items-end justify-between w-full mt-4 md:justify-start xl:mt-0 gap-x-4">
            <BiUser className="w-24 h-24 p-2 rounded bg-slate-300" />
            <button className="underline decoration-secondary text-secondary">
              Change
            </button>
          </div>
          <div className="flex flex-col justify-between gap-4 mt-6 md:flex-row">
            <div className="flex flex-col gap-2">
              <label htmlFor="first-names" className="font-light">
                First Name(s)
              </label>
              <input
                {...register('Name', { required: true })}
                defaultValue={data?.Name}
                type="text"
                className="w-full p-2 rounded ring-1 ring-black"
                onChange={setNAME}
              />
              {errors['Name'] && (
                <span className="text-xs text-red-500 ">
                  First Name is required
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="first-names" className="font-light">
                Last Name
              </label>
              <input
                {...register('Surname', { required: true })}
                defaultValue={data?.Surname}
                type="text"
                className="w-full p-2 rounded ring-1 ring-black"
                onChange={setSNAME}
              />
              {errors['Surname'] && (
                <span className="text-xs text-red-500 ">
                  Last Name is required
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col w-full gap-2 mt-6">
            <label htmlFor="first-names" className="font-light">
              Bio
            </label>
            <textarea
              {...register('Bio', { required: false })}
              defaultValue={data?.Bio}
              className="w-full p-2 rounded ring-1 ring-black"
              onChange={setBIO}
            />
          </div>
          <div className="mt-8">
            <button className="px-4 py-2 text-sm font-light text-white btn btn-primary bg-primary">
              {loadingUserProfileUpdate ? (
                <CgSpinner className="w-5 h-5 animate-spin" />
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="grid w-full grid-cols-10 mt-8">
        <div className="col-span-10 mt-2 xl:col-span-2">
          Account Information
        </div>
        <div className="col-span-full md:col-span-5 xl:col-span-4">
          <p className="px-4 py-2 mt-4 text-xs font-bold rounded xl:mt-0 bg-sky-100 text-sky-900"></p>
          <div className="shadow-lg alert alert-info">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="flex-shrink-0 w-6 h-6 stroke-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span className='text-white'>
                To udpate password, fill in Current password, New password and
                then click on Update Passord button..
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-4 mt-4 md:flex-col">
            <div className="flex flex-col gap-2">
              <label htmlFor="first-names" className="font-light">
                Username
              </label>
              <input
                disabled
                defaultValue={data?.email}
                type="text"
                className="w-full p-2 rounded disabled:opacity-70 disabled:cursor-not-allowed ring-1 ring-black"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="first-names" className="font-light">
                Email
              </label>
              <input
                disabled
                defaultValue={data?.email}
                type="text"
                className="w-full p-2 rounded disabled:opacity-70 disabled:cursor-not-allowed ring-1 ring-black"
              />
            </div>
          </div>
          <div className="flex flex-col justify-between gap-4 mt-6 md:flex-row">
            <div className="flex flex-col gap-2">
              <label htmlFor="first-names" className="font-light">
                Current Password
              </label>
              <input
                defaultValue={''}
                type="password"
                className="w-full p-2 rounded disabled:opacity-70 disabled:cursor-not-allowed ring-1 ring-black"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="first-names" className="font-light">
                New Password
              </label>
              <input
                defaultValue={''}
                type="password"
                className="w-full p-2 rounded disabled:opacity-70 disabled:cursor-not-allowed ring-1 ring-black"
              />
            </div>
          </div>
          <div className="mt-8">
            <button className="px-4 py-2 text-sm font-light text-white btn btn-primary">
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
