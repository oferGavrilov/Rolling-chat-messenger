import { storageService } from './async-storage.service'
import { utilService } from './util.service'
const STORAGE_KEY = 'watcherDB'

_createWatchers()

export const watcherService = {
    query,
    remove
}

async function query() {
    return await storageService.query(STORAGE_KEY)
}

async function remove(watcherId) {
    return await storageService.remove(STORAGE_KEY, watcherId)
}

function _createWatchers() {
    let watchers = utilService.loadFromStorage(STORAGE_KEY)
    if (!watchers || !watchers.length) {
        watchers = []
        watchers.push(_createWatcher('Puki Ba', ['Rambo', 'Rocky']))
        watchers.push(_createWatcher('Muki Da', ['Spider-man']))
        watchers.push(_createWatcher('Shuki Sa', ['Harry Potter']))
        utilService.saveToStorage(STORAGE_KEY, watchers)
    }
}

function _createWatcher(name, movies) {
    return {
        _id: utilService.makeId(),
        name,
        movies,
        imgUrl: 'https://cdn.pixabay.com/photo/2021/09/04/15/51/man-6598112_960_720.png'
    }
}