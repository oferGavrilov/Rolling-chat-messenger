import { AnimalList } from "../cmps/animal-list";
import { CountDown } from "../cmps/count-down";
import { MouseMonitor } from "../cmps/mouse-monitor";
import { SeasonClock } from "../cmps/season-clock";
import { WatcherApp } from "../cmps/watcher-app";
import { utilService } from "../services/util.service";

export function HomeRoute() {
    const animals = [
        {
            type: 'Malayan Tiger',
            count: 787,
            _id: utilService.makeId()
        },
        {
            type: 'Mountain Gorilla',
            count: 212,
            _id: utilService.makeId()
        },
        {
            type: 'Fin Whale',
            count: 28,
            _id: utilService.makeId()
        }
    ]

    function onDone() {
        console.log('Done!')
    }

    return (
        <>
            <AnimalList animals={animals} />
            <SeasonClock />
            <CountDown startFrom={10} onDone={onDone} />
            <MouseMonitor />
            <WatcherApp />
        </>
    )
}