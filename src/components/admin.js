import React, { Component } from 'react';
import CanvasJSReact from '../canvasjs-2.3.2/canvasjs.react';
import Pusher from 'pusher-js';
import axios from 'axios';
let _this = null
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default class Admin extends Component {

  constructor() {
    super();
    this.state = {
      dataPoints: [
        { label: "A", y: 0 },
        { label: "B", y: 0 },
        { label: "C", y: 0 },
        { label: "D", y: 0 },
      ],
      btn_disabled: false
    }

  }
  onStartSurvey = () => {
    
    axios.post('http://localhost:7000/polls/timer', { timer: 'start' })
      .then((data) => {
        this.setState({
          btn_disabled: true
        })
        this.timer()
      })
  }
  timer = () => {
    var t = new Date()
    t.setSeconds(t.getSeconds() + 30)
    var x = setInterval(() => {
      var now = new Date().getTime()
      var distance = t.getTime() - now
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      document.getElementById("timer").innerHTML = minutes + ":" + seconds;
      if (distance < 0) {
        this.setState({
          btn_disabled: false
        })
        clearInterval(x);
        document.getElementById("timer").innerHTML = "Survey Stopped";
      }
    })
  }

  componentDidMount = () => {
    _this = this
    Pusher.logToConsole = true;

    var pusher = new Pusher('ae4e4ae9c1f3e842a401', {
      cluster: 'ap2',

    });

    var channel = pusher.subscribe('poll');
    let dataPoints = this.state.dataPoints
    channel.bind('vote', function (data) {

      dataPoints = dataPoints.map(x => {
        if (x.label === data.option) {
          x.y += data.points;
          return x
        }
        else {
          return x
        }
      });
      _this.setState({
        dataPoints: dataPoints
      })
      console.log(_this.state.dataPoints)
    });
  }




  render() {


    return (
      <div>
        <div style={{margin:'10px'}}>
          <input type="submit" value="START SURVEY" className="btn btn-primary" disabled={this.state.btn_disabled} onClick={() => this.onStartSurvey()} />
        </div>
        <div>
          <p id="timer"></p>
        </div>
        <CanvasJSChart options={{
          title: {
            text: "Poll Results"
          },
          data: [{
            type: "column",
            dataPoints: this.state.dataPoints
          }]
        }}
          onRef={ref => this.chart = ref}
        />

      </div>
    );

  }
}