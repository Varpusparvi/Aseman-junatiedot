import React, { Component } from 'react';
import './index.css';
import Axios from 'axios';
import TextFieldAutosuggest from './TextFieldAutosuggest'
import Tab from './Tab';

// Used Material-ui, Axios, Moment Timezone , react-autosuggest

/*
* Train arrival/departure view
*/
class TrainInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            trainsArriving : [],
            trainsDeparting : [],
            stations: [],
            searchedShortCode: "",
            value : ""
        }
        
        this.search = this.search.bind(this);
    }

    componentDidMount() {
        this.getStationsAxios();
    }

    /*
    *   GETs train API for specific station by stationCode
    */
    getTrainsAxios(stationCode) {
        const minutesToTrack = 1440;    // 0-1440 minutes
        const amountToShow = 10;
        const allowedTypes = ["IC", "P" ,"S", "R"]; // Allowed trainTypes

        Axios.get('https://rata.digitraffic.fi/api/v1/live-trains/station/' + stationCode + 
                                            "?minutes_before_departure=" + minutesToTrack + 
                                            "&minutes_after_departure=" + minutesToTrack + 
                                            "&minutes_before_arrival=" + minutesToTrack + 
                                            "&minutes_after_arrival=" + minutesToTrack)
        .then((response) => {
            // Arrival, Sort the trains by date
            let trainsArriving = [];
            for (let i = 0; i < response.data.length; i++) {
                trainsArriving.push(response.data[i]);
            }
            // Check that table only contains arriving trains
            if (trainsArriving.length > 0) {
                for (let i = 0; i < trainsArriving.length; i++) {
                    let k = false;      // Is arriving?
                    for (let j = 0; j < trainsArriving[i].timeTableRows.length; j++) {
                        if (trainsArriving[i].timeTableRows[j].stationShortCode === stationCode &&
                            trainsArriving[i].timeTableRows[j].type === "ARRIVAL") {
                            if (trainsArriving[i].timeTableRows[j].actualTime === undefined) {
                                if (new Date(trainsArriving[i].timeTableRows[j].scheduledTime).getTime() > Date.now()){
                                    k = true;
                                }
                            } else {
                                if (new Date(trainsArriving[i].timeTableRows[j].actualTime).getTime() > Date.now()) {
                                    k = true;
                                }
                            }
                        }
                    }
                    if (k === false) {
                        trainsArriving.splice(i,1);
                        i--;
                    }
                }
                // Sort by date
                trainsArriving.sort(function (a,b) {
                    let dateA;
                    let dateB;
                    for (let i = 0; i < a.timeTableRows.length; i++) {
                        if (a.timeTableRows[i].stationShortCode === stationCode && a.timeTableRows[i].type === "ARRIVAL") {
                            if (a.timeTableRows[i].actualTime === undefined || a.timeTableRows[i].actualTime === null) {
                                dateA = new Date(a.timeTableRows[i].scheduledTime);
                            } else {
                                dateA = new Date(a.timeTableRows[i].actualTime);
                            }
                        }
                    }

                    for (let i = 0; i < b.timeTableRows.length; i++) {
                        if (b.timeTableRows[i].stationShortCode === stationCode && b.timeTableRows[i].type === "ARRIVAL") {
                            if (b.timeTableRows[i].actualTime === undefined || b.timeTableRows[i].actualTime === null) {
                                dateB = new Date(b.timeTableRows[i].scheduledTime);
                            } else {
                                dateB = new Date(b.timeTableRows[i].actualTime);
                            }
                        }
                    }
                    return dateA - dateB;
                })

                // Check against allowedTypes
                for (let i = 0; i < trainsArriving.length; i++) {
                    if (!allowedTypes.includes(trainsArriving[i].trainType)) {
                        trainsArriving.splice(i, 1 );
                        i--;
                    }
                }

                // Shorten to "amountToShow"
                for (let i = 0; trainsArriving.length > amountToShow; i++) {
                    trainsArriving.pop();
                }
            }
            // Departure, Sort the trains by date
            let trainsDeparting = [];
            for (let i = 0; i < response.data.length; i++) {
                trainsDeparting.push(response.data[i]);
            }
            // Check that table only contains departing trains
            if (trainsDeparting.length > 0) {
                for (let i = 0; i < trainsDeparting.length; i++) {
                    let k = false;      // Is departing?
                    for (let j = 0; j < trainsDeparting[i].timeTableRows.length; j++) {
                        if (trainsDeparting[i].timeTableRows[j].stationShortCode === stationCode &&
                            trainsDeparting[i].timeTableRows[j].type === "DEPARTURE") {
                            if (trainsDeparting[i].timeTableRows[j].actualTime === undefined) {
                                if (new Date(trainsDeparting[i].timeTableRows[j].scheduledTime).getTime() > Date.now()){
                                    k = true;
                                }
                            } else {
                                if (new Date(trainsDeparting[i].timeTableRows[j].actualTime).getTime() > Date.now()) {
                                    k = true;
                                }
                            }
                        }
                    }
                    if (k === false) {
                        trainsDeparting.splice(i,1);
                        i--;
                    }
                }
                // Sort by date
                trainsDeparting.sort(function (a,b) {
                    let dateA;
                    let dateB;
                    for (let i = 0; i < a.timeTableRows.length; i++) {
                        if (a.timeTableRows[i].stationShortCode === stationCode && a.timeTableRows[i].type === "DEPARTURE") {
                            if (a.timeTableRows[i].actualTime === undefined || a.timeTableRows[i].actualTime === null) {
                                dateA = new Date(a.timeTableRows[i].scheduledTime);
                            } else {
                                dateA = new Date(a.timeTableRows[i].actualTime);
                            }
                        }
                    }
                    
                    for (let i = 0; i < b.timeTableRows.length; i++) {
                        if (b.timeTableRows[i].stationShortCode === stationCode && b.timeTableRows[i].type === "DEPARTURE") {
                            if (b.timeTableRows[i].actualTime === undefined || b.timeTableRows[i].actualTime === null) {
                                dateB = new Date(b.timeTableRows[i].scheduledTime);
                            } else {
                                dateB = new Date(b.timeTableRows[i].actualTime);
                            }
                        }
                    }
                return dateA - dateB;
                })

                // Check against allowedTypes
                for (let i = 0; i < trainsDeparting.length; i++) {
                    if (!allowedTypes.includes(trainsDeparting[i].trainType)) {
                        trainsDeparting.splice(i, 1 );
                        i--;
                    }
                }

                // Shorten to "amountToShow"
                for (let i = 0; trainsDeparting.length > amountToShow; i++) {
                    trainsDeparting.pop();
                }
            }
            
            this.setState({
                trainsArriving : trainsArriving,
                trainsDeparting : trainsDeparting
            })
        })
    }

    /*
    *   GETs station API for stationShortCodes
    */
    getStationsAxios() {
        Axios.get('https://rata.digitraffic.fi/api/v1/metadata/stations')
        .then((response) => {
            let stations = [];
            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].passengerTraffic === true) {
                    stations.push(response.data[i]);
                }
            }
            this.setState({
                stations : response.data
            })
        })
    }


    /*
    * Searches VRs API for matches and sets them in state
    */
    search(haku) {
        if (this.state.stations === []) {
            console.log("Virhe: this.state.stations === []")
            return;
        }
        haku = haku.toLowerCase().trim();
        for (let i = 0; i < this.state.stations.length; i++) {
            if (this.state.stations[i].stationName.toLowerCase() === haku) {
                this.setState({
                    searchedShortCode : this.state.stations[i].stationShortCode
                })
                this.getTrainsAxios(this.state.stations[i].stationShortCode);
            }
        }
    }

    handleChange = () => event => {
        this.setState({
          value: event.target.value,
        });
        this.search(event.target.value);
      };

    render() {
        return (
            <div className="main">
                <div>
                    <div className="topBar" id="topBar">
                        <div className="title">Aseman junatiedot</div>
                        <div className="cc4">Liikennetietojen lähde Traffic Management Finland / digitraffic.fi, lisenssi <a href="https://creativecommons.org/licenses/by/4.0/legalcode.fi">CC 4.0 BY</a></div>
                    </div>
                </div>
                <div className="content">
                    <div className="searchbar">
                        <div className="searchTitle">Hae aseman nimellä</div>
                        <TextFieldAutosuggest suggestions={this.state.stations} 
                                                onChange={this.handleChange}
                                                search={this.search}></TextFieldAutosuggest>
                    </div>
                    <div className="table">
                        <Tab searchedShortCode={this.state.searchedShortCode} 
                                    stations={this.state.stations} 
                                    trainsArriving={this.state.trainsArriving} 
                                    trainsDeparting={this.state.trainsDeparting}></Tab>
                    </div>
                </div>
            </div>
        )
    }
}


export default TrainInfo;