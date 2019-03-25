import React from 'react';
import moment from 'moment-timezone';
import Divider from '@material-ui/core/Divider';

/*
* Formats the date into a given timezone
*/
function formatDate(date, timezone) {
  try {
    date = moment(date);
    date = date.tz(timezone).format();
    return date;
  } catch {
    return "Error: Date in wrong format";
  }
}

/*
* Converts the date in ISO8601 format into a time within a day
*/
function convertTimeToString(ISO8601) {
  try {
    let string = ISO8601.slice(11,13) + ':' + ISO8601.slice(14,16)/* + ' ' + 
    ISO8601.slice(8,10) + '.' + ISO8601.slice(5,7) + '.' + ISO8601.slice(0,4)*/;
    return string;
  } catch {
    return "Error: Date in wrong format";
  }
}

/*
Calculates the arrival or departure of train
object === train
true === arriving train
false === departing train
*/
function scheduledTime(props, object, bool) {
  let scheduledTime;
  let actualTime;
  let cancelled;
  if (bool === true) {  // If calculating arrival
      for (let i = 0; i < object.timeTableRows.length; i++) {
          if (object.timeTableRows[i].stationShortCode === props.searchedShortCode &&
              object.timeTableRows[i].type === "ARRIVAL") {
              if (object.timeTableRows[i].liveEstimateTime === undefined) {
                  scheduledTime = new Date(object.timeTableRows[i].scheduledTime);
                  scheduledTime = formatDate(scheduledTime, "Europe/Helsinki");
                  scheduledTime = convertTimeToString(scheduledTime);
              } else if (object.cancelled === true) {
                  cancelled = true;
                  scheduledTime = new Date(object.timeTableRows[i].scheduledTime);
                  scheduledTime = formatDate(scheduledTime, "Europe/Helsinki");
                  scheduledTime = convertTimeToString(scheduledTime);
              } else {
                  if (object.timeTableRows[i].differenceInMinutes > 0) {
                      actualTime = new Date(object.timeTableRows[i].liveEstimateTime);
                      actualTime = formatDate(actualTime, "Europe/Helsinki");
                      actualTime = convertTimeToString(actualTime);
                  }
                  scheduledTime = new Date(object.timeTableRows[i].scheduledTime);
                  scheduledTime = formatDate(scheduledTime, "Europe/Helsinki");
                  scheduledTime = convertTimeToString(scheduledTime);
              }
          }
      }
  } else {              // If calculating departure
      for (let i = 0; i < object.timeTableRows.length; i++) {
          if (object.timeTableRows[i].stationShortCode === props.searchedShortCode &&
              object.timeTableRows[i].type === "DEPARTURE") {
              if (object.timeTableRows[i].liveEstimateTime === undefined) {
                  scheduledTime = new Date(object.timeTableRows[i].scheduledTime);
                  scheduledTime = formatDate(scheduledTime, "Europe/Helsinki");
                  scheduledTime = convertTimeToString(scheduledTime);
              } else if (object.cancelled === true) {
                  cancelled = true;
                  scheduledTime = new Date(object.timeTableRows[i].scheduledTime);
                  scheduledTime = formatDate(scheduledTime, "Europe/Helsinki");
                  scheduledTime = convertTimeToString(scheduledTime);
              } else {
                  if (object.timeTableRows[i].differenceInMinutes > 0) {
                      actualTime = new Date(object.timeTableRows[i].liveEstimateTime);
                      actualTime = formatDate(actualTime, "Europe/Helsinki");
                      actualTime = convertTimeToString(actualTime);
                  }
                  scheduledTime = new Date(object.timeTableRows[i].scheduledTime);
                  scheduledTime = formatDate(scheduledTime, "Europe/Helsinki");
                  scheduledTime = convertTimeToString(scheduledTime);
              }
          }
      }
  }
  if (cancelled === true) {
      return(
          <div>
              <div>{scheduledTime}</div>
              <div className="actualTime">Cancelled</div>
          </div>
      );
  } else if (actualTime === undefined) {
      return(
          <div>
              <div>{scheduledTime}</div>
          </div>
      );
  } else if (actualTime !== undefined) {
      return(
          <div>
              <div className="actualTime">{actualTime}</div>
              <div>({scheduledTime})</div>
          </div>
      );
  }
}

/*
*   Gets the station full name from the given stationShortCode
*/
function getStationName(props, stationShortCode) {
  for (let i = 0; i < props.stations.length; i++) {
      if (stationShortCode === props.stations[i].stationShortCode) {
      let stationName = props.stations[i].stationName;
      return (
          <div>
          {stationName}
          </div>
      );
      }
  }
}

/*
* Table for arriving and departing trains
*/
function Table(props) {
  if (props.value === 0) {
    return(
      <div className="table">
        <div className="header">
          <div className="headerTitleTrain">Juna</div>
          <div className="headerTitle">Lähtöasema</div>
          <div className="headerTitle">Pääteasema</div>
          <div className="headerTitle">Saapuu</div>
        </div>
        <Divider />
        {props.trainsArriving.map(row => {
          return row.cancelled ?   // If train is cancelled
          <div key={row.trainType + row.trainNumber} className="cancelled">
            <div className="row">
              <div className="rowContentTrain">{row.trainType} {row.trainNumber}</div>
              <div className="rowContent">{getStationName(props, row.timeTableRows[0].stationShortCode)}</div>
              <div className="rowContent">{getStationName(props, row.timeTableRows[row.timeTableRows.length - 1].stationShortCode)}</div>
              <div className="rowContent">{scheduledTime(props, row, true)}</div>
            </div>
              <Divider />
          </div>
            :         // Else
          <div key={row.trainType + row.trainNumber}>
            <div className="row">
              <div className="rowContentTrain">{row.trainType} {row.trainNumber}</div>
              <div className="rowContent">{getStationName(props, row.timeTableRows[0].stationShortCode)}</div>
              <div className="rowContent">{getStationName(props, row.timeTableRows[row.timeTableRows.length - 1].stationShortCode)}</div>
              <div className="rowContent">{scheduledTime(props, row, true)}</div>
            </div>
              <Divider />
          </div>
        })}
      </div>
  )} else {
    return (
      <div className="table">
        <div className="header">
          <div className="headerTitleTrain">Juna</div>
          <div className="headerTitle">Lähtöasema</div>
          <div className="headerTitle">Pääteasema</div>
          <div className="headerTitle">Lähtee</div>
        </div>
        <Divider />
        {props.trainsDeparting.map(row => {
          return row.cancelled ?   // If train is cancelled
          <div key={row.trainType + row.trainNumber} className="cancelled">
            <div className="row">
              <div className="rowContentTrain">{row.trainType} {row.trainNumber}</div>
              <div className="rowContent">{getStationName(props, row.timeTableRows[0].stationShortCode)}</div>
              <div className="rowContent">{getStationName(props, row.timeTableRows[row.timeTableRows.length - 1].stationShortCode)}</div>
              <div className="rowContent">{scheduledTime(props, row, false)}</div>
            </div>
              <Divider />
          </div>
            :         // Else
          <div key={row.trainType + row.trainNumber}>
            <div className="row">
              <div className="rowContentTrain">{row.trainType} {row.trainNumber}</div>
              <div className="rowContent">{getStationName(props, row.timeTableRows[0].stationShortCode)}</div>
              <div className="rowContent">{getStationName(props, row.timeTableRows[row.timeTableRows.length - 1].stationShortCode)}</div>
              <div className="rowContent">{scheduledTime(props, row, false)}</div>
            </div>
              <Divider />
          </div>
        })}
      </div>
    )}
}

export default Table;
