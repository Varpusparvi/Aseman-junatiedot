import React from 'react';
import Table from './Table';
import Button from 'react-bootstrap/Button';

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
                        <Button variant="light" onClick={this.handleChange} className="buttonActive">Saapuvat</Button>
                        <Button variant="light" onClick={this.handleChange} className="buttonInactive">Lähtevät</Button>
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
                        <Button variant="light" onClick={this.handleChange} className="buttonActive">Saapuvat</Button>
                        <Button variant="light" onClick={this.handleChange} className="buttonInactive">Lähtevät</Button>
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

export default Tab;