import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import TrainTable from './TrainTable';

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
    backgroundColor: theme.palette.background.paper,
  },
});

class SimpleTabs extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
          <Tabs value={value} onChange={this.handleChange}>
            <Tab label="Saapuvat" />
            <Tab label="Lähtevät" />
          </Tabs>
        {value === 0 && <TabContainer>
                          <TrainTable value={this.state.value} 
                                      searchedShortCode={this.props.searchedShortCode}
                                      stations={this.props.stations}
                                      trainsArriving={this.props.trainsArriving}></TrainTable>
                        </TabContainer>}
        {value === 1 && <TabContainer>
                          <TrainTable value={this.state.value} 
                                      searchedShortCode={this.props.searchedShortCode}
                                      stations={this.props.stations}
                                      trainsDeparting={this.props.trainsDeparting}></TrainTable>
                        </TabContainer>}
      </div>
    );
  }
}

SimpleTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTabs);