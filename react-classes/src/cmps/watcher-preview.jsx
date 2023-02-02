import { BsFillTrashFill } from 'react-icons/bs'
export function WatcherPreview({ watcher, onRemoveWatcher }) {

    return (
        <>
            <img src={watcher.imgUrl} alt="" />
            <h4 className="watcher-name">{watcher.name}</h4>
            <div className='btns-container'>
                <button><BsFillTrashFill onClick={() => onRemoveWatcher(watcher._id)} /></button>
                <button>Select</button>
            </div>
        </>
    )
}