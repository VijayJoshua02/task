import React, { Component } from 'react';
import axios from 'axios'
import Pusher from 'pusher-js';
let _this = null;
export default class Poll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: '',
            btn_disabled: true
        }
    }
    handleOptionChange = (e) => {
        this.setState({
            selectedOption: e.target.value,
        });
    }
    timer = () => {
        this.setState({
            btn_disabled: false
        })
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
                    btn_disabled: true
                })
                clearInterval(x);
                document.getElementById("timer").innerHTML = "Poll Expired";
            }
        })
      }


    onSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:7000/polls', { option: this.state.selectedOption })
            .then((data) => {
                console.log(`Voted ${this.state.selectedOption}`)
            })
    }
    componentDidMount = () => {
        _this = this
        var pusher = new Pusher('ae4e4ae9c1f3e842a401', {
            cluster: 'ap2',
          });
          var channel = pusher.subscribe('timer')
          channel.bind('start', function(data) {
              _this.timer()
          })
        }


    render() {
        return (
            <div>
                <div className="timer">
                <p id='timer'>Timer</p>
                </div>
                <h5>Pick it!</h5>
                {/* <Admin message="data from polls"/> */}
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
                        <input type="submit" value="SUBMIT" className="btn btn-primary" disabled={this.state.btn_disabled}/>
                    </div>
                </form>
            </div>

        )
    }
}