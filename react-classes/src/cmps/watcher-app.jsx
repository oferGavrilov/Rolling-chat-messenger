import { Component } from "react";
import { connect } from "react-redux";
import { loadWatchers, removeWatcher } from "../store/actions/watcher.actions";



export class _WatcherApp extends Component {
    componentDidMount() {
        this.props.loadWatchers()
    }

    render() {
        return (
            <section className="watcher-app">
                <h1 className="title">Watcher app</h1>
                <button className="add-watcher-btn">Add watcher</button>
                <div className="watcher-list">

                </div>
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