import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation'

import styles from '@/styles/home.module.css'
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
        <span  className={styles.separatorText} >--------------- OR ---------------</span>
        <button onClick={createAndJoin}>Create a new room</button>
    </div>
  )
}
