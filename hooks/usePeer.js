const { useState, useEffect, useRef } = require("react")

const usePeer = () => {
    const [peer, setPeer] = useState(null)
    const [myId, setMyId] = useState("")
    const isPeerSet = useRef(false)

    useEffect(() => {
        if (isPeerSet.current) return;
        isPeerSet.current = true;
        (async function initPeer() {
            const myPeer = new (await import("peerjs")).default()
            setPeer(myPeer)
            //We are importing in this manner because server side rendering doesnt supports windows or dom objects

            myPeer.on("open", (id) => {
                console.log("peer id:", id);
                setMyId(id)
            })
        })()
    }, [])

    return(
        peer,
        myId
    )
}

export default usePeer