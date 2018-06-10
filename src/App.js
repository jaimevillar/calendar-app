import React, { Component } from 'react';
import './App.css';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import SelectCountry from 'react-flags-select';
import Calendar from './components/calendar/calendar';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: null,
            days: null,
            countryCode: null,
            date: Date.now(),
            endDate: null,
            showCalendar: false,
        };
    }

  handleChange = name => event => {
    switch (name) {
        case "days":
            this.state.days = event.target.value;
            break;
        case "countryCode":
            this.state.countryCode = event.target.value;
            break;
        case "startDate":
            var selectedDate = Date.parse(event.target.value);
            this.state.startDate = selectedDate;
            break;
    }

    if (this.state.days !== null && this.state.startDate !== null && this.state.countryCode !== null) {
        this.state.endDate = this.state.startDate + (parseInt(this.state.days) * 86400000);
        this.setState({showCalendar: true});
        console.info('new state: ', this.state);
    } else {
        this.setState({showCalendar: false});
    }
  };

  onSelectCountry(countryCode) {
      console.info('selected country: ', countryCode);
      this.state.countryCode = countryCode;
      alert('Country Code selected: ' + countryCode);
  }

  prevMonth() {
    let date = new Date(this.state.date);
    date.setMonth(date.getMonth() - 1);
    this.setState({date: date.getTime()});
  }

  nextMonth() {
    let date = new Date(this.state.date);
    date.setMonth(date.getMonth() + 1);
    this.setState({date: date.getTime()});
  }

  setRange(selectionStart = 0, selectionEnd = 0) {
    this.setState({selectionStart, selectionEnd});
  }

  render() {
    const { classes } = this.props;
    const { startDate, days, endDate, showCalendar } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Calendar App</h1>
        </header>
        <div className={classes.root}>
            <Grid container spacing={24}>
                <Grid item md={12}>
                    <TextField
                        id="date"
                        label="Start Date"
                        type="date"
                        className={classes.textField}
                        onChange={this.handleChange('startDate')}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item md={12}>
                    <TextField
                        className={classes.textField}
                        id="days"
                        label="Number of days"
                        onChange={this.handleChange('days')}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="normal"
                    />
                </Grid>
                <Grid item md={12}>
                    <TextField
                        id="country-code"
                        className={classes.textField}
                        label="Country code"
                        placeholder="Country code"
                        margin="normal"
                        onChange={this.handleChange('countryCode')}
                    />
                    { /* <SelectCountry onSelect={this.onSelectCountry.bind(this)}/> */ }
                </Grid>
                <Grid item md={12}>
                    <label>{this.state.countryCode}</label>
                </Grid>
            </Grid>
            {showCalendar ?
                <div className={classes.container}>
                    <Grid>
                        <Paper className={classes.paper} elevation={4}>
                            <Calendar startDate={startDate} endDate={endDate} days={days} />
                        </Paper>
                    </Grid>
                </div> : null
            }
        </div>
      </div>
    );
  }
}

const styles = theme => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        margin: '30px'
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    menu: {
        width: 200,
    },
    root: {
        flexGrow: 1,
        padding: 30,
    },
    paper: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
        marginTop: theme.spacing.unit * 3,
    }),
});

export default withStyles(styles)(App);
