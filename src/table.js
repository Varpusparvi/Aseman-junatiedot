import React from 'react';
import moment from 'moment-timezone';

class Table extends React.Component {
  constructor(props) {
    super(props);

    this.scheduledTime = this.scheduledTime.bind(this);
    this.getStationName = this.getStationName.bind(this);
  }

  scheduledTime(object, bool) {
    let scheduledTime;
    if (bool === true) {  // If calculating arrival
      for (let i = 0; i < object.timeTableRows.length; i++) {
        if (object.timeTableRows[i].stationShortCode === this.props.searchedShortCode &&
            object.timeTableRows[i].type === "ARRIVAL") {
            scheduledTime = object.timeTableRows[i].scheduledTime;
            scheduledTime = formatDate(scheduledTime, "Europe/Helsinki");
            scheduledTime = convertTimeToString(scheduledTime);
        }
      }
    } else {              // If calculating departure
      for (let i = 0; i < object.timeTableRows.length; i++) {
        if (object.timeTableRows[i].stationShortCode === this.props.searchedShortCode &&
            object.timeTableRows[i].type === "DEPARTURE") {
            scheduledTime = object.timeTableRows[i].scheduledTime;
            scheduledTime = formatDate(scheduledTime, "Europe/Helsinki");
            scheduledTime = convertTimeToString(scheduledTime);
        }
      }
    }

    return(
      <div>
        {scheduledTime}
      </div>
    );
  }

  getStationName(stationShortCode) {
    for (let i = 0; i < this.props.passengerStations.length; i++) {
      if (stationShortCode === this.props.passengerStations[i].stationShortCode) {
        let stationName = this.props.passengerStations[i].stationName;
        return (
          <div>
            {stationName}
          </div>
        );
      }
    }
  }

  render () {
    if (this.props.value === 0) {
      return(
        <table>
        <tbody>
          <tr>
            <th>Juna</th>
            <th>Lähtöasema</th>
            <th>Pääteasema</th>
            <th>Saapuu</th>
          </tr>
        {this.props.trainsArriving.map((x) => 
            <tr key={x.trainNumber}>
              <td><div>{x.trainNumber} {x.trainType}</div></td>
              <td>{this.getStationName(x.timeTableRows[0].stationShortCode)}</td>
              <td>{this.getStationName(x.timeTableRows[x.timeTableRows.length - 1].stationShortCode)}</td>
              <td>{this.scheduledTime(x, true)}</td>
            </tr>
        )}
      </tbody>
    </table>
    )} else {
      return(
        <table>
        <tbody>
          <tr>
            <th>Juna</th>
            <th>Lähtöasema</th>
            <th>Pääteasema</th>
            <th>Lähtee</th>
          </tr>
        {this.props.trainsDeparting.map((x) => 
            <tr key={x.trainNumber}>
              <td><div>{x.trainNumber} {x.trainType}</div></td>
              <td>{this.getStationName(x.timeTableRows[0].stationShortCode)}</td>
              <td>{this.getStationName(x.timeTableRows[x.timeTableRows.length - 1].stationShortCode)}</td>
              <td>{this.scheduledTime(x, false)}</td>
            </tr>
        )}
      </tbody>
    </table>
    )}
  }
}

export default Table;

/*
* Formats the date into a given timezone
*/
function formatDate(date, timezone) {
  date = moment(date);
  date = date.tz(timezone).format();
  return date;
}

/*
* Converts the date in ISO8601 format into a time within a day
*/
function convertTimeToString(ISO8601) {
  let string = ISO8601.slice(11,13) + ':' + ISO8601.slice(14,16) + ' ' + 
  ISO8601.slice(8,10) + '.' + ISO8601.slice(5,7) + '.' + ISO8601.slice(0,4);
  return string;
}