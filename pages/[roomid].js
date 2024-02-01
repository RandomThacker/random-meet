import { useSocket } from "@/context/socket";
import usePeer from "@/hooks/usePeer";
import { useEffect } from "react";
import useMediaStream from "@/hooks/useMediaStream";
import Player from "@/components/Player";
import usePlayer from "@/hooks/usePlayer";
import styles from "@/styles/room.module.css";
import Bottom from "@/components/Bottom";
import { useRouter } from "next/router";
import { cloneDeep } from "lodash";
import { useState } from "react";
import CopySection from "@/components/CopySection";
import { useApp } from "@/context/appContext";

import useDisplayMedia from "./../hooks/useDisplayMedia";
const Room = () => {
  const socket = useSocket();
  const { roomId } = useRouter().query;
  const { peer, myId } = usePeer();
  const { stream } = useMediaStream();
  const { screenStream } = useDisplayMedia();


  const {
    players,
    setPlayers,
    playerHighlighted,
    playerNonHighlighted,
    toggleAudio,
    leaveRoom,
    toggleVideo,
  } = usePlayer(myId, roomId, peer);
  const [users, setUsers] = useState([]);
  const leaveAudioURL = `https://res.cloudinary.com/dzbmc0pit/video/upload/v1703051749/vea2o3irg4so2f6lan0r.mp3`;
  const [leaveAudio,setLeaveAudio]=useState(null)
  const [joinAudio,setJoinAudio]= useState(null)
  const { frontFacing,screenShare } = useApp();
  const joinAudioURL = `https://res.cloudinary.com/dzbmc0pit/video/upload/v1703051513/inib5q5dohfvgynlsyra.mp3`;
 

  useEffect(() => {
   
    if (!socket || !stream || !peer) return;
    const handleUserConnected = (newUser) => {
      console.log(`USER CONNECTED WITH USERID ${newUser}`);
      // joinAudio.play();
      const call = peer.call(newUser, stream);
      call.on("stream", (userStream) => {
        console.log(`INCOMING STREAM FROM USER ${newUser}`);
        // joinAudio.play();
        setPlayers((prev) => ({
          ...prev,
          [newUser]: {
            url: userStream,
            muted: true,
            playing: true,
          },
        }));

        setUsers((prev) => ({
          ...prev,
          [newUser]: call,
        }));
      });
    };

    socket.on("user-connected", handleUserConnected);
    return () => {
      socket.off("user-connected", handleUserConnected);
    };
  }, [peer, stream, socket, setPlayers, joinAudio]);

  useEffect(() => {
    if (!peer || !stream) return;
    peer.on("call", (call) => {
      const { peer: callerId } = call;
      call.answer(stream);
      call.on("stream", (userStream) => {
        console.log(`INCOMING STREAM FROM USER ${callerId}`);
        setPlayers((prev) => ({
          ...prev,
          [callerId]: {
            url: userStream,
            muted: true,
            playing: true,
          },
        }));

        setUsers((prev) => ({
          ...prev,
          [callerId]: call,
        }));
      });
    });
  }, [peer, setPlayers, stream]);

  useEffect(() => {
    if (!socket) return;
    const handleToggleAudio = (userId) => {
      console.log(`user with id ${userId} toggled audio`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        copy[userId].muted = !copy[userId].muted;
        return { ...copy };
      });
    };

    const handleToggleVideo = (userId) => {
      console.log(`user with id ${userId} toggled video`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        copy[userId].playing = !copy[userId].playing;
        return { ...copy };
      });
    };

    const handleUserLeave = (userId) => {
      console.log(`user ${userId} is leaving the room`);
      users[userId]?.close();
      // leaveAudio.play();
      const playersCopy = cloneDeep(players);
      delete playersCopy[userId];
      setPlayers(playersCopy);
    };
    socket.on("toggle-audio", handleToggleAudio);
    socket.on("toggle-video", handleToggleVideo);
    socket.on("leave", handleUserLeave);
    return () => {
      socket.off("toggle-audio", handleToggleAudio);
      socket.off("toggle-video", handleToggleVideo);
      socket.off("leave", handleUserLeave);
    };
  }, [players, setPlayers, socket, users]);

  useEffect(() => {


    if (!stream || !myId) return;
    console.log(`SETTING STREAM WITH PEER ID ${myId}`);
    setPlayers((prev) => ({
      ...prev,
      [myId]: {
        url: (screenShare && screenStream)? screenStream : stream,
        muted: true,
        playing: true,
      },
    }));
  }, [myId, setPlayers, stream, frontFacing,screenStream,screenShare]);

  return (
    <>
      <div className={styles.activePlayerContainer}>
        {playerHighlighted && (
          <Player
            url={playerHighlighted.url}
            muted={playerHighlighted.muted}
            playing={playerHighlighted.playing}
            isActive
          />
        )}
      </div>
      <div className={styles.inActivePlayerContainer}>
        {Object.keys(playerNonHighlighted).map((playerId) => {
          const { url, muted, playing } = playerNonHighlighted[playerId];
          return (
            <Player
              key={playerId}
              url={url}
              muted={muted}
              playing={playing}
              isActive={false}
            />
          );
        })}
      </div>
      <CopySection roomId={roomId} />
      <Bottom
        muted={playerHighlighted?.muted}
        playing={playerHighlighted?.playing}
        toggleAudio={toggleAudio}
        toggleVideo={toggleVideo}
        leaveRoom={leaveRoom}
      />
    </>
  );
};

export default Room;
