import { useSocket } from "@/context/socket";
import usePeer from "@/hooks/usePeer";
import useMediaStream from "@/hooks/useMediaStream";
import Player from "@/component/Player";
import { useEffect } from "react";

const Room = () => {
    const socket = useSocket()
    const { peer, myId } = usePeer()
    const { stream } = useMediaStream()

    useEffect(()=>{
        if(!socket)return;
        const handleUserConnected = (newUser)=>{
            console.log("use connected with user id",newUser);
        }
        socket.on("user-connected",handleUserConnected)
        return ()=>{
            socket.off("user-connected",handleUserConnected)
        }
    },[socket])

    return (
        <div>
            <Player url={stream} muted playing playerId ={myId}/>        
        </div>
    )
};

export default Room