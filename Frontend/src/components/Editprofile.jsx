import React from 'react'
import { RxCross1 } from "react-icons/rx";
import { useContext } from 'react';
import { UserDataCtx } from '../context/UserContext';

const Editprofile = () => {
  const { UserData,editProfileOpen,setEditProfileOpen } = useContext(UserDataCtx);

  const handleeditProfileOpen=()=>{
    setEditProfileOpen(!editProfileOpen);
  }

  return (
    <div className='fixed w-full h-[100vh] top-0 z-[100] flex justify-center items-center'>

      <div className='w-full h-full bg-black opacity-[0.5] absolute'></div>
      <div className='w-[90%] max-w-[500px] h-[600px] bg-white absolute z-[200] shadow-lg rounded-lg'>

        <div><RxCross1 className='absolute top-4 right-4 cursor-pointer'
        onClick={handleeditProfileOpen}
        /></div>
      </div>

    </div>
  )
}

export default Editprofile