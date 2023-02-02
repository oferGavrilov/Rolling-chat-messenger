import {storageService} from './async-storage.service'
import { utilService } from './util.service'
const STORAGE_KEY = 'watcherDB'

_createWatchers()

export const watcherService = {
    query
}

async function query() {
    return await storageService.query(STORAGE_KEY)
}

function _createWatchers() {
    let watchers = utilService.loadFromStorage(STORAGE_KEY)
    if(!watchers || !watchers.length){
        watchers = []
        watchers.push(_createWatcher('Puki Ba' ,['Rambo' , 'Rocky']))
        watchers.push(_createWatcher('Muki Da' ,['Spider-man']))
        watchers.push(_createWatcher('Shuki Sa' ,['Harry Potter']))
        utilService.saveToStorage(STORAGE_KEY, watchers)
    }
}

function _createWatcher(type , count){
    return {
        _id: utilService.makeId(),
        type,
        count,
    }
}