import { Component } from "react";


export class MouseMonitor extends Component{
    state = {
        x:0,
        y:0
    }
    isOn = false
    componentDidMount() {
        document.addEventListener('mousemove' , (ev) => {
            if(this.isOn) return
            this.setState({x:ev.clientX, y:ev.clientY})
        })
    }

    toggleIsOn = () => {
        this.isOn = !this.isOn
    }

    render() {
        return (
            <section className="mouse-monitor">
                <span>Mouse position</span>
                <span>x:{this.state.x}, y:{this.state.y}</span>
                <button onClick={() => this.toggleIsOn()}>{this.isOn ? 'Resume' : 'Pause'}</button>
            </section>
        )
    }
}