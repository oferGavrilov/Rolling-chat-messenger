import { Component } from "react";
import { utilService } from "../services/util.service";







export class CountDown extends Component {
    state = {
        startFrom: this.props.startFrom,
        done: this.props.onDone
    }
    
    componentDidMount() {
        this.update = setInterval(() => {
            if(this.state.startFrom <= 0) {
                this.stopCount()
                this.props.onDone()
                return  
            } 
            this.setState(prevState => ({ startFrom: prevState.startFrom - 1 }))
        }, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.update)
    }

    stopCount() {
        clearInterval(this.update)
    }

    render() {
        return (
            <section className="count-down">
                <h1 className="title">Count down</h1>
                <div className="count-container">
                    <h3 className={`${this.state.startFrom <= 6 ? 'red' : ''}`}>{this.state.startFrom}</h3>
                    <button onClick={() => this.stopCount()}>Stop</button>
                </div>
            </section>
        )
    }
}