import { useSocket } from "@/context/socket";
import usePeer from "@/hooks/usePeer";
import useMediaStream from "@/hooks/useMediaStream";
import Player from "@/component/Player";
import { useEffect } from "react";
import usePlayer from "@/hooks/usePlayer";

const Room = () => {
    const socket = useSocket()
    const { peer, myId } = usePeer()
    const { stream } = useMediaStream()
    const {players,setPlayers} = usePlayer()

    useEffect(()=>{
        if(!socket || !peer || !stream || !setPlayers)return;
        const handleUserConnected = (newUser)=>{
            console.log("use connected with user id",newUser);

            const call = peer.call(newUser, stream)

            call.on("stream",(incomingStream)=>{
                console.log("incoming Stream from new user",newUser);
                setPlayers((prev)=>({...prev,
                    [newUser]:{
                        url:incomingStream,
                        muted:false,
                        playing:true
                    }
                })) 
            })
        }
        socket.on("user-connected",handleUserConnected)
        return ()=>{
            socket.off("user-connected",handleUserConnected)
        }
    },[socket,peer,stream,setPlayers])

    useEffect(()=>{
        if(!peer || !stream || !setPlayers) return;
        peer.on("call",(call) =>{
            const{peer:callerId} = call;
            call.answer(stream)

            call.on("stream",(incomingStream)=>{
                console.log(`incoming stream from ${callerId}`);

                setPlayers((prev)=>({...prev,
                    [callerId]:{
                        url:incomingStream,
                        muted:false,
                        playing:true
                    }
                })) 
            })
        })
    },[peer,stream, setPlayers])

    useEffect(()=>{
        if(!stream || !myId || !setPlayers) return;
        console.log("Setting my strem", myId);
        setPlayers((prev) => ({
            ...prev,[myId]: {
                url:stream,
                muted:false,
                playing:true
            }
        }))
    },[myId, setPlayers, stream])

    return (
        <div>
        {Object.keys(players).map((playerId) => {
                const {url,muted,playing} = players[playerId]

                return <Player key = {playerId} url={url} muted={muted} playing={playing}/>        

            })}
        </div>
    )
};

export default Room