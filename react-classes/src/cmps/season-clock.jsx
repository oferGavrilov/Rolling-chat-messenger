import { Component } from "react";
import { utilService } from "../services/util.service";

const autumn = require('../assets/styles/imgs/autumn.png')
const summer = require('../assets/styles/imgs/summer.png')
const spring = require('../assets/styles/imgs/spring.png')
const winter = require('../assets/styles/imgs/winter.png')

export class SeasonClock extends Component {
    state = {
        clock: new Date(),
        isDark: true
    }

    componentDidMount() {
        this.update = setInterval(() => {
            this.setState({ clock: new Date() })
        }, 1000);
    }
    componentWillUnmount() {
        clearInterval(this.update)
    }

    getSeasonName = () => {
        const season = utilService.getSeason(this.state.clock)
        switch (season) {
            case 'Winter':
                return winter
            case 'Spring':
                return spring
            case 'Summer':
                return summer
            case 'Autumn':
                return autumn
            default:
                return summer
        }
    }

    toggleBgColor = () => {
        this.setState(prevState => ({ isDark: !prevState.isDark }))
    }

    render() {
        const { clock, isDark } = this.state
        return (
            <section className={`season-clock ${isDark ? 'dark' : ''}`} onClick={() => this.toggleBgColor()}>
                <h1 className="title">Clock</h1>
                <div className="season-container">
                    <h4>{utilService.getMonthName(clock)} ({utilService.getSeason(clock)})</h4>
                    <img src={this.getSeasonName()} alt="season" />
                    <p>{clock.toLocaleTimeString()}</p>
                </div>
            </section>
        )
    }
}