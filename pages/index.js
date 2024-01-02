import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation'
import { useState } from 'react';

export default function Home() {
  const router = useRouter()
  const [roomId, setRoomId] = useState('')

  const createAndJoin = () => {
    const roomId = uuidv4()
    router.push(`/${roomId}`)
  }

  const joinRoom = () => {
    if (roomId) router.push(`/${roomId}`)
    else {
      alert("Please provide a valid room id")
    }
  }
  return (
    <div className="w-full h-[100vh] p-2 rounded text-white flex flex-col items-center">
      <div className="w-full flex flex-row justify-around">
        <h1>Random Meet</h1>
        </div>
        <h1 className="text-center text-xxl ">Enjoy your meet without google listening to it XD</h1>
        <div className="flex w-[500px] items-center mt-3" >
          <input className="text-black text-lg p-1 rounded w-full mb-3" placeholder='Enter Room ID' value={roomId} onChange={(e) => setRoomId(e?.target?.value)}/>
          <button onClick={joinRoom} className=" bg-buttonPrimary py-2 px-4 rounded ">Join Room</button>
        </div>
        <span  className=" my-3 text-xl" >--------------- OR ---------------</span>
        <button className=" bg-buttonPrimary py-2 px-4 rounded" onClick={createAndJoin}>Create a new room</button>
    </div>
  )
}