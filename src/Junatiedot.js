import React, { Component } from 'react';
import './index.css';
import SimpleTabs from './tabs';
import OutlinedTextFields from './textfield';
import Axios from 'axios';

// Material-ui, Jest, Axios, Moment Timezone

/*
* Train arrival/departure view
*/
class Junatiedot extends Component {
    constructor(props) {
        super(props);

        this.state = {
            trainsArriving : [],
            trainsDeparting : [],
            passengerStations: [],
            searchedShortCode: ""
        }
        
        this.getStationsAxios();

        this.search = this.search.bind(this);
    }

    /*
    *   GETs train API for specific station by stationCode
    */
    getTrainsAxios(stationCode) {
        Axios.get('https://rata.digitraffic.fi/api/v1/live-trains/station/' + stationCode )
        .then((response) => {
            // Arrival, Sort the trains by date
            let trainsArriving = [];
            for (let i = 0; i < response.data.length; i++) {
                trainsArriving.push(response.data[i]);
            }
            // Check that table only contains arriving trains
            for (let i = 0; i < trainsArriving.length; i++) {
                let k = false;      // Is arriving?
                for (let j = 0; j < trainsArriving[i].timeTableRows.length; j++) {
                    if (trainsArriving[i].timeTableRows[j].stationShortCode === stationCode &&
                        trainsArriving[i].timeTableRows[j].type === "ARRIVAL") {
                            k = true;
                    }
                }
                if (k === false) {
                    trainsArriving.splice(i,1);
                    i--;
                }
            }
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

            // Departure, Sort the trains by date
            let trainsDeparting = [];
            for (let i = 0; i < response.data.length; i++) {
                trainsDeparting.push(response.data[i]);
            }
            // Check that table only contains departing trains
            for (let i = 0; i < trainsDeparting.length; i++) {
                let k = false;      // Is departing?
                for (let j = 0; j < trainsDeparting[i].timeTableRows.length; j++) {
                    if (trainsDeparting[i].timeTableRows[j].stationShortCode === stationCode &&
                        trainsDeparting[i].timeTableRows[j].type === "DEPARTURE") {
                            k = true;
                    }
                }
                if (k === false) {
                    trainsDeparting.splice(i,1);
                    i--;
                }
            }
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
            let passengerStations = [];
            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].passengerTraffic === true) {
                    passengerStations.push(response.data[i]);
                }
            }
            console.log(passengerStations);
            this.setState({
                passengerStations : response.data
            })
        })
    }


    /*
    * Searches VRs API for matches and sets them in state
    */
    search(haku) {
        if (this.state.passengerStations === []) {
            console.log("Virhe: this.state.passengerStations === []")
            return;
        }

        for (let i = 0; i < this.state.passengerStations.length; i++) {
            if (this.state.passengerStations[i].stationName === haku) {
                this.setState({
                    searchedShortCode : this.state.passengerStations[i].stationShortCode
                })
                this.getTrainsAxios(this.state.passengerStations[i].stationShortCode);
            }
        }
    }

    /*
    *   Render
    */
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
                        <SimpleTabs searchedShortCode={this.state.searchedShortCode} passengerStations={this.state.passengerStations} trainsArriving={this.state.trainsArriving} trainsDeparting={this.state.trainsDeparting}></SimpleTabs>
                    </div>
                </div>
            </div>
        )
    }
}


export default Junatiedot;