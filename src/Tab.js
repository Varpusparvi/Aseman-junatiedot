import React from 'react';
import Button from '@material-ui/core/Button';
import Table from './Table';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    buttonActive: {
        textTransform: 'none',
        color: 'green',
    },
    buttonInactive: {
        textTransform: 'none',
        color: 'black',
    }
  };

/*
*   Tab component where the tab buttons are
*/
class Tab extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 0,
        }
    }

    /*
    *   Handle select tab
    */
    handleChange = (event) => {
        if (event.target.textContent === "Saapuvat" && this.state.value === 1) {
            this.setState({
                value : 0
            });
        }
        if (event.target.textContent === "Lähtevät" && this.state.value === 0) {
            this.setState({
                value : 1
            });
        }
      };

    render() {
        const value = this.state.value;
        const {classes} = this.props;
        if (value === 0) {
            return (
                <div className="tabContainer">
                    <div className="tab">
                        <Button onClick={this.handleChange} className={classes.buttonActive}>Saapuvat</Button>
                        <Button onClick={this.handleChange} className={classes.buttonInactive}>Lähtevät</Button>
                    </div>
                    <div>
                        <Table value={this.state.value} 
                            searchedShortCode={this.props.searchedShortCode}
                            stations={this.props.stations}
                            trainsArriving={this.props.trainsArriving}></Table>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="tabContainer">
                    <div className="tab">
                        <Button onClick={this.handleChange} className={classes.buttonInactive}>Saapuvat</Button>
                        <Button onClick={this.handleChange} className={classes.buttonActive}>Lähtevät</Button>
                    </div>
                    <div>
                        <Table value={this.state.value} 
                            searchedShortCode={this.props.searchedShortCode}
                            stations={this.props.stations}
                            trainsDeparting={this.props.trainsDeparting}></Table>
                    </div>
                </div>
            );
        };
    }
}

export default withStyles(styles)(Tab);