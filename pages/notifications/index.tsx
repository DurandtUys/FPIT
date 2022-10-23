/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable-next-line */
import { PrismaClient } from '@prisma/client';

export interface NotificationsProps {}

import Notification  from "../../components/notification"; 

export async function getServerSideProps() 
{
  const prisma = new PrismaClient();

    const notifications = await prisma.notification.findMany({
      where: { userId: 1,Type:{contains:"Notification"}},
    });

    const delet = await prisma.notification.deleteMany({
      where: {Type:{contains:"Notification"}, userId: 1 },
    });

    return {props: {notifications}};
}

export function Notifications({notifications=[]}) {
  
  if(notifications.length != 0)
  {
    return (
      <div>
            {notifications.map(notifications => (
              <Notification key = {notifications.id}{...notifications} Type={notifications.Type} number={notifications.id} message={notifications.message}></Notification>
            ))}
      </div>
    );
  }
  else
  {
    return (
      <div className="flex items-center w-full h-10 shadow-md rounded-lg p-4 lg:max-w-[95%] ml-5 mt-5 bg-blue-200">
        <h1>No notifications found</h1>
      </div>
    );
  }
  
}

function deleteAll()
{
  const table_api = 'http://localhost:3333/api/notification/deletenotification';

  async function del()
  {
    const  Form = "userid=1";

    const response = await fetch(table_api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: Form,
    });

    if (response.status == 201) {
      console.log("delete Success")
    }

    if(response.status == 500)
    {
      console.log("No notifications found")
    }
  }
  del();
}

export default Notifications;
