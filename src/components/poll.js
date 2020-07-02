import React, { Component } from 'react';
import axios from 'axios'
import CanvasJSReact from '../canvasjs-2.3.2/canvasjs.react';
import Pusher from 'pusher-js';
import Admin from './admin';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
export default class Poll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: ''
        }
    }
    handleOptionChange = (e) => {
        this.setState({
            selectedOption: e.target.value
        });
    }


    onSubmit = (e) => {
        e.preventDefault()
        let dataPoints = [
            { label: "A", y: 0 },
            { label: "B", y: 0 },
            { label: "C", y: 0 },
            { label: "D", y: 0 },
        ]
        const chartContainer = document.querySelector('#chartContainer');
        
        if (chartContainer) {
            var chart = new CanvasJSChart.Chart("chartContainer",
                {
                    animationEnabled: true,
                    theme: "theme2",
                    data: [
                        {
                            type: "column",
                            dataPoints: dataPoints
                        }
                    ]
                });
            chart.render();
        }
        Pusher.logToConsole = true

        var pusher = new Pusher('a4645a38865120f41cec', {
            cluster: 'ap2',
            encrypted: true
        });
       
        
      
        var channel = pusher.subscribe('poll');
        
        channel.bind_global(function(event, data) {
            console.log(event)
          dataPoints = dataPoints.map(x => {
            if(x.label == data.framework) {
              x.y += data.points;
              return x
            } else {
              return x
            }
          });
      
        })


        var app = {
            polls: document.querySelectorAll('.radio-btn'),
            options: ['A', 'B', 'C', 'D']
        }

        app.handlePollEvent = function (event, index) {
            const option = this.options[index];
            axios.post('http://localhost:7000/polls', { option: option })
                .then((data) => {
                    console.log(`Voted ${option}`)
                })
        }


        app.setup = function () {
            this.polls.forEach((option, index) => {
                option.addEventListener('click', (event) => {
                    this.handlePollEvent(event, index)
                }, true)
            })
        }

        app.setup();

    }



    render() {
        return (
            <div>
                <h5>Pick it!</h5>
                <Admin message="data from polls"/>
                <form onSubmit={this.onSubmit}>
                    <div className="radio">
                        <label>
                            <input type="radio" value="A"
                                style={{ margin: '10px' }}
                                checked={this.state.selectedOption === 'A'}
                                onChange={this.handleOptionChange}
                                className="radio-btn"

                            />
        A
      </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="B"
                                style={{ margin: '10px' }}
                                checked={this.state.selectedOption === 'B'}
                                onChange={this.handleOptionChange}
                                className="radio-btn"
                            />
        B
      </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="C"
                                style={{ margin: '10px' }}
                                checked={this.state.selectedOption === 'C'}
                                onChange={this.handleOptionChange}
                                className="radio-btn"
                            />
        C
      </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="D"
                                style={{ margin: '10px' }}
                                checked={this.state.selectedOption === 'D'}
                                onChange={this.handleOptionChange}
                                className="radio-btn"
                            />
        D
      </label>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="SUBMIT" className="btn btn-primary" />
                    </div>
                </form>
                <script src="server.js"></script>
            </div>

        )
    }
}