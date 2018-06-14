import React, { Component } from 'react';
import './App.css';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Calendar from './components/calendar/calendar';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: null,
            days: null,
            countryCode: null,
            endDate: null,
            showCalendar: false,
        };
    }

  handleChange = name => event => {
    switch (name) {
        case "days":
            this.setState({
                days: event.target.value,
            });
            break;
        case "countryCode":
            this.setState({
                countryCode: event.target.value,
            });
            break;
        case "startDate":
            this.setState({
                startDate: Date.parse(event.target.value),
            });
            break;
        default:
            this.setState({
                startDate: null,
                days: null,
                countryCode: null,
                endDate: null,
                showCalendar: false,
            });
            break;
    }

      if (this.state.days !== null && this.state.startDate !== null) {
          this.setState({
              endDate: this.state.startDate + (parseInt(this.state.days, 10) * 86400000),
          });
      }

  };

  render() {
    const { classes } = this.props;
    const { startDate, endDate } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Calendar App</h1>
        </header>
        <div className={classes.root}>
            <Grid container spacing={24}>
                <Grid item md={6}>
                    <Grid container>
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
                        </Grid>
                        <Grid item md={12}>
                            <label className={classes.countryCode}>{this.state.countryCode}</label>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item md={6}>
                        <div className={classes.container}>
                                <Paper className={classes.paper} elevation={4}>
                                    <Calendar startDate={startDate} endDate={endDate}/>
                                </Paper>
                        </div>
                </Grid>
            </Grid>

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
    button: {
        margin: '50px',
    },
    countryCode: {
        color: '#af0101',
        fontWeight: 'bold',
    }
});

export default withStyles(styles)(App);
