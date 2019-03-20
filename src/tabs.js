import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, withTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Table from "./table";

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,

  },
});

class SimpleTabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          value: 0,
          trains: []
        };

        this.handleChange = this.handleChange.bind(this);        
    }

  handleChange(event, value) {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange}>
            <Tab label="Saapuvat" />
            <Tab label="Lähtevät" />
          </Tabs>
        </AppBar>
        {value === 0 && <TabContainer><Table trainsArriving={this.props.trainsArriving}></Table></TabContainer>}
        {value === 1 && <TabContainer><Table trainsDeparting={this.props.trainsDeparting}></Table></TabContainer>}
      </div>
    );
  }
}

SimpleTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTabs);
