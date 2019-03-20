import React from 'react';

class Table extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    if (this.props.trainsArriving === undefined) {
      return(
        <div> ei toimi</div>
      )
    } else if (this.props.trainsDeparting === undefined) {
      return(
        <div> ei toimi</div>
      )
    } else {
      return(
        <table>
          <tr>
            <th>Juna</th>
            <th>Lähtöasema</th>
            <th>Pääteasema</th>
            <th>Saapuu</th>
          </tr>
        {this.props.trainsArriving.map((x) => 
          <div>perse
            <tr>perse{x.trainNumber}</tr>
          </div>
        )}
      </table>
    )}
  }
}

export default Table;