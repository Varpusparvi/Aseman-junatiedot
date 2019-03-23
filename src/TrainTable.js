import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment-timezone';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 500,
  },
});

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
    let string = ISO8601.slice(11,13) + ':' + ISO8601.slice(14,16)/* + ' ' + 
    ISO8601.slice(8,10) + '.' + ISO8601.slice(5,7) + '.' + ISO8601.slice(0,4)*/;
    return string;
}

/*
* Calculates the arrival or departure of train
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
*   Defines the table in which the trains will be shown
*/
function TrainTable(props) {
    const { classes } = props;
    if (props.value === 0) {
        return (
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>Juna</TableCell>
                        <TableCell>Lähtöasema</TableCell>
                        <TableCell>Pääteasema</TableCell>
                        <TableCell>Saapuu</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {props.trainsArriving.map(row => (
                    <TableRow key={row.trainType + row.trainNumber}>
                        <TableCell component="th" scope="row">
                            {row.trainType} {row.trainNumber}
                        </TableCell>
                        <TableCell>{getStationName(props, row.timeTableRows[0].stationShortCode)}</TableCell>
                        <TableCell>{getStationName(props, row.timeTableRows[row.timeTableRows.length - 1].stationShortCode)}</TableCell>
                        <TableCell>{scheduledTime(props, row, true)}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        )
    } else {
        return (
            <Grid>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Juna</TableCell>
                            <TableCell>Lähtöasema</TableCell>
                            <TableCell>Pääteasema</TableCell>
                            <TableCell>Saapuu</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {props.trainsDeparting.map(row => (
                        <TableRow key={row.trainType + row.trainNumber}>
                            <TableCell component="th" scope="row">
                                {row.trainType} {row.trainNumber}
                            </TableCell>
                            <TableCell>{getStationName(props, row.timeTableRows[0].stationShortCode)}</TableCell>
                            <TableCell>{getStationName(props, row.timeTableRows[row.timeTableRows.length - 1].stationShortCode)}</TableCell>
                            <TableCell>{scheduledTime(props, row, false)}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </Grid>
        )
    }
}

TrainTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TrainTable);