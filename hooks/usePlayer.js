import { useState } from "react";

const usePlayer = () => {
    const [players, setPlayers] = useState({});

    return { players, setPlayers }; // Return an object with players and setPlayers
};

export default usePlayer;
