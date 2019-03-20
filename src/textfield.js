import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
  },
});


/*
* Textfield for search
*/
class ComposedTextField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }


  componentDidMount() {
    this.forceUpdate();
  }


  handleChange(event) {
    this.setState({ name: event.target.value });
  };


  handleConfirm(event) {
    if (event.key === "Enter") {
      this.props.exportSearch(event.target.value);
    }
  }


  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <FormControl className={classes.formControl}>
          <Input id="component-simple" value={this.state.name} onChange={this.handleChange} onKeyPress={this.handleConfirm} />
        </FormControl>
      </div>
    );
  }
}


ComposedTextField.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(ComposedTextField);
