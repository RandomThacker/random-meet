import ReactPlayer from 'react-player'



const Player = (props) => {
    const {playerId, url, muted, playing} = props
    return (
        <div>
            <ReactPlayer url={url} muted={muted} playing={playing}/>
        </div>
    )
}

export default Player;