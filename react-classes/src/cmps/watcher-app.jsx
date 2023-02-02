import { Component } from "react";
import { connect } from "react-redux";
import { loadWatchers, removeWatcher } from "../store/actions/watcher.actions";
import { WatcherPreview } from "./watcher-preview";



export class _WatcherApp extends Component {
    componentDidMount() {
        this.props.loadWatchers()
    }

    onRemoveWatcher = (watcherId) => {
        console.log(watcherId)
        try {
            this.props.removeWatcher(watcherId)
        } catch (err) {
            console.log('err', err)
        }
    }

    render() {
        const { watchers } = this.props
        return (
            <section className="watcher-app">
                <h1 className="title">Watcher app</h1>
                <button className="add-watcher-btn">Add watcher</button>
                <ul className="watcher-list">
                    {watchers.map(watcher => <li className="watcher-preview" key={watcher._id}><WatcherPreview watcher={watcher} onRemoveWatcher={this.onRemoveWatcher} /></li>)}
                </ul>
            </section>
        )
    }
}

const mapStateToProps = storeState => ({
    watchers: storeState.watcherModule.watchers,
})

const mapDispatchToProps = {
    loadWatchers,
    removeWatcher,
}

export const WatcherApp = connect(mapStateToProps, mapDispatchToProps)(_WatcherApp)