import React, { Component } from 'react';
import './index.css';
import SimpleTabs from './tabs';
import OutlinedTextFields from './textfield';

// GraphQl, Material-ui, Paho-MQTT, Yarn, Jest, Axios


/*
* Train arrival/departure view
*/
class Junatiedot extends Component {
    constructor(props) {
        super(props);

        this.getTrains("");
        this.getStations();

        this.state = {
            trainsArriving : [],
            trainsDeparting : [],
            passengerStations: []
        }
        
        this.search = this.search.bind(this);
        this.getStations = this.getStations.bind(this);
        this.getTrains = this.getTrains.bind(this);
        this.setStates = this.setStates.bind(this);
    }

    componentDidMount() {

    }

    
    /*
    * Searches VRs API for matches and sets them in state
    */
   search(haku) {
        console.log(haku);
        if (this.state.passengerStations === []) {
            return;
        }

        for (let i = 0; i < this.state.passengerStations.length; i++) {
            if (this.state.passengerStations[i].stationName === haku) {
                this.getTrains('"' + this.state.passengerStations[i].stationShortCode + '"');
            }
        }
        let gg = this.getTrains("HKI");
        console.log(gg);
    }


    /*
    *   GETs train API for specific station by stationCode
    */
    getTrains(stationCode) {
        let request = new XMLHttpRequest();
        
        request.open('GET', "https://rata.digitraffic.fi/api/v1/live-trains/station/HKI" + stationCode , true);
        
        request.onload = function () {
            let data = JSON.parse(request.response);
            console.log(data);
            // Helvetilläkö?
            this.setStates(data);
            // Helvetilläkö?
        }
        
        // Send the request for API
        request.send();
    }


    /*
    *   GETs station API for stationShortCodes
    */
    getStations() {
        let request = new XMLHttpRequest();
        
        request.open('GET', "https://rata.digitraffic.fi/api/v1/metadata/stations", true);
        
        request.onload = function () {
            let data = JSON.parse(request.response);
            console.log(data);
            return data;
        }
        
        // Send the request for API
        request.send();
    }

    setStates(trainsArriving) {
        this.setState({
            trainsArriving : trainsArriving
        })
    }


    render() {
        return (
            <div className="main">
                <div>
                    <div className="topBar" id="topBar">
                        <div className="title">Aseman junatiedot</div>
                        <div className="title">Liikennetietojen lähde Traffic Management Finland / digitraffic.fi, lisenssi <a href="https://creativecommons.org/licenses/by/4.0/legalcode.fi">CC 4.0 BY</a></div>
                    </div>
                </div>
                <div className="content">
                    <div className="searchbar">
                        <div className="searchTitle">Hae aseman nimellä</div>
                        <OutlinedTextFields exportSearch={this.search}></OutlinedTextFields>
                    </div>
                    <div className="table">
                        <SimpleTabs trainsArriving={this.state.trainsArriving} trainsDeparting={this.state.trainsDeparting}></SimpleTabs>
                    </div>
                </div>
            </div>
        )
    }
}


export default Junatiedot;