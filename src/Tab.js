import React from 'react';
import Table from './Table';
import Button from 'react-bootstrap/Button';


const Tab = ({searchedShortCode, stations, trainsArriving, trainsDeparting, tabValue, setTabValue}) => {

    const handleChange = (event) => {
        console.log(tabValue);
        console.log(event.target.textContent);
        if (event.target.textContent === "Saapuvat" && tabValue === 1) {
            setTabValue(0);
        }
        if (event.target.textContent === "Lähtevät" && tabValue === 0) {
            setTabValue(1);
        }
    }
    
    if (tabValue === 0) {
        return (
            <div className="tabContainer">
                <div className="tab">
                    <Button variant="light" onClick={handleChange} className="buttonActive">Saapuvat</Button>
                    <Button variant="light" onClick={handleChange} className="buttonInactive">Lähtevät</Button>
                    </div>
                <div>
                    <Table value={tabValue} 
                        searchedShortCode={searchedShortCode}
                        stations={stations}
                        trainsArriving={trainsArriving}></Table>
                </div>
            </div>
            );
        } else {
            return (
                <div className="tabContainer">
                    <div className="tab">
                        <Button variant="light" onClick={handleChange} className="buttonActive">Saapuvat</Button>
                        <Button variant="light" onClick={handleChange} className="buttonInactive">Lähtevät</Button>
                    </div>
                <div>
                    <Table value={tabValue} 
                    searchedShortCode={searchedShortCode}
                    stations={stations}
                    trainsDeparting={trainsDeparting}></Table>
                </div>
            </div>
            )
        }
    }

export default Tab;