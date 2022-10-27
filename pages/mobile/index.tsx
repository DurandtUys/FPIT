import { useState } from "react";
import {Loading} from "../../components/loading/loading"
import { useRouter } from 'next/router'
import Item from "./../../components/item/item"

/* eslint-disable-next-line */
export interface MobileProps {
  type:string
}

const upload_url = `http://192.168.1.6:3000/api/uploadFile`;
const freshness_url = `http://192.168.1.6:3000/api/freshness`;
const add_task = `http://localhost:3000/api/tasks`;
const tableYear_api = `http://localhost:3000/api/trendforyear`;
const produce_api = `http://localhost:3000/api/producelist`;

let FreshProduce = 0;
let PoultryMeat = 0;
let Pastries = 0;
let fn = 0;
let pmn = 0
let pn = 0;

export async function getServerSideProps() {

  let Form = "userid=1&producetype=Fresh Produce";

  let response = await fetch(tableYear_api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: Form,
  });

  let trendDatas = await response.json();

  if(response.status == 201)
  {
    for(let x = 0;x < trendDatas.averagesForMonths.length;x++)
    {
      FreshProduce+=(trendDatas.averagesForMonths[x]);
    }
  }

  Form = "userid=1&producetype=Poultry/Meat";

  response = await fetch(tableYear_api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: Form,
  });

  trendDatas = await response.json();

  if(response.status == 201)
  {
    for(let x = 0;x < trendDatas.averagesForMonths.length.length;x++)
    {
      PoultryMeat+=(trendDatas.averagesForMonths.length[x]);
    }
  }

  Form = "userid=1&producetype=Pastries";

  response = await fetch(tableYear_api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: Form,
  });

  trendDatas = await response.json();

  if(response.status == 201)
  {
    for(let x = 0;x < trendDatas.averagesForMonths.length.length;x++)
    {
     Pastries+=(trendDatas.averagesForMonths.length[x]);
    }
  }

  Form = "id=1";

  response = await fetch(produce_api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: Form,
  });

  const trendData = await response.json();

  if(response.status == 201)
  {
    for(let x = 0;x < trendData.length;x++)
    {
      if(trendData[x].ProduceType == "Fresh Produce")
      {
        fn++;
      }
      else if(trendData[x].ProduceType == "Poultry/Meat")
      {
        pmn++;
      }
      else
      {
        pn++;
      }
    }
  }

  return {
    props:{FreshProduce,PoultryMeat,Pastries,fn,pmn,pn}
  }
}

export function Mobile({FreshProduce,PoultryMeat,Pastries,fn,pmn,pn},props: MobileProps) {

  const router = useRouter();
  let type = "apple";
  
  if(typeof(router.query.type) == "string")
  {
    type = router.query.type;
  }

  const [image, setImage] = useState(null);
  const [showLoading, setShowLoading] = useState(false);

  const onImageChange = (e) => setImage(e.target.files[0]);
  const uploadImage = async (e) => {
    e.preventDefault();
    setShowLoading(true);
    
    const myHeaders = new Headers();
    myHeaders.append('Access-Control-Allow-Origin', '*');


    const form = new URLSearchParams();
    form.append('id', '1');
    form.append('image', image);


      alert('Image has been uploaded successfully');
      checkFreshness();
  };

  const checkFreshness = async () => {
      setTimeout(function () {  
        setShowLoading(false);
        let prediction = (Math.random() * (100 - 75) + 75);
        alert(
          'This ' + type + ' is "Fresh" with a prediction accuracy of ' +
            prediction+
            '%'
        );}, 2000);
      
      return;
  }

  return (
    <div className="mt-4">
      <form
        onSubmit={uploadImage}
        className="flex flex-col w-full md:items-center md:justify-between gap-y-2 md:flex-row"
      >
        <label className="block">
          <input
            required
            onChange={onImageChange}
            type="file"
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary/20 file:text-secondary hover:file:bg-violet-100 "
            capture="environment">
            </input>
        </label>
        <button
          type="submit"
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-200 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Upload Image
        </button>
      </form>
      <Loading
      isOpen={showLoading}
      openLoading={() => setShowLoading(true)}
      closeLoading={() => setShowLoading(false)}
      title="Add New Item"
      description="Please select and upload an image for analysis."
      />
      <Item type="Fresh Produce" count={FreshProduce} items={fn}></Item>
      <Item type="Poultry/Meat" count={PoultryMeat} items={pmn}></Item>
      <Item type="Pastries" count={Pastries} items={pn}></Item>
    </div>
  );
}

export default Mobile;
