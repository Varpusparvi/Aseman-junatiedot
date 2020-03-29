import React from 'react';
import {useState, useEffect} from 'react';
import './index.css';
import Axios from 'axios';
import TextFieldAutosuggest from './TextFieldAutosuggest'
import Tab from './Tab';

// Used Material-ui, Axios, Moment Timezone , react-autosuggest

export const App = () => {
    var [trainsArrivingParsed, setTrainsArrivingParsed] = useState([]);
    var [trainsDepartingParsed, setTrainsDepartingParsed] = useState([]);
    var [stations, setStations] = useState([]);
    var [searchedShortCode, setSearchedShortCode] = useState("");
    var [value, setValue] = useState("");
    var [tabValue, setTabValue] = useState(0);

    
    /*
    *   GETs station API for stationShortCodes
    */
    const getStationsAxios = async () => {
        Axios.get('https://rata.digitraffic.fi/api/v1/metadata/stations')
        .then((response) => {
            let stationsData = [];
            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].passengerTraffic === true) {
                    stationsData.push(response.data[i]);
                }
            }
            setStations(stationsData);
            console.log(stationsData);
        })
    }


    /*
    *   GETs train API for specific station by stationCode
    */
    const getTrainsAxios = (stationCode) => {
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
            
            setTrainsArrivingParsed(trainsArriving);
            setTrainsDepartingParsed(trainsDeparting);
            console.log("Response: ",response);
            console.log("Arriving: ",trainsArriving);
            console.log("Departing: ",trainsDeparting);
        })
    }


    /*
    * Searches VRs API for matches and sets them in state
    */
    const search = (haku) => {
        console.log(haku);
        if (stations === [] || stations === undefined) {
            console.log("Virhe: stations empty or undefined")
            return;
        }
        haku = haku.toLowerCase().trim();
        console.log(stations.length);
        for (let i = 0; i < stations.length; i++) {
            console.log(stations[i].stationName.toLowerCase());
            if (stations[i].stationName.toLowerCase() === haku) {
                setSearchedShortCode(stations[i].stationShortCode);
                getTrainsAxios(stations[i].stationShortCode);
            }
        }
    }

    /**
     * handles change in search field
     */
    const handleChange = () => e => {
        setValue(e.target.value);
        search(value);
    }

    // DidComponentMount
    useEffect(() => {
        getStationsAxios();
    }, [])


    return(
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
                <TextFieldAutosuggest suggestions={stations} 
                    onChange={handleChange}
                    search={search}></TextFieldAutosuggest>
            </div>
            <div className="table">
                <Tab searchedShortCode={searchedShortCode} 
                    stations={stations} 
                    trainsArriving={trainsArrivingParsed} 
                    trainsDeparting={trainsDepartingParsed}
                    tabValue={tabValue}
                    setTabValue={setTabValue}></Tab>
            </div>
        </div>
    </div>
    );
}