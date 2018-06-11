import React from 'react';
import moment from 'moment';
import './calendar.css';

export default class Calendar extends React.Component {
    state = {
        dateContext: moment(),
        daysLimit: null,
        startDate: null,
        endDate: null,
        firstDay: null,
        lastDay: null,
    };

    constructor(props) {
        super(props);
        this.width = props.width || "350px";
        this.style = props.style || {};
        this.style.width = this.width;
    }

    componentWillReceiveProps = (nextProps) => {
        const { startDate, endDate, days } = nextProps;

        this.state.daysLimit = days;
        this.state.startDate = new Date(startDate);
        this.state.endDate = new Date(endDate);

        this.state.firstDay = new Date(startDate).getUTCDate();
        this.state.lastDay = new Date(endDate).getUTCDate();

        console.info('first day selected: ', this.state.firstDay);
        console.info('last day selected: ', this.state.lastDay);
        // console.info('state in calendar: ', this.state);
    };

    weekdaysShort = moment.weekdaysMin();
    months = moment.months();

    year = () => {
        return this.state.dateContext.format("Y");
    };
    month = () => {
        return this.state.dateContext.format("MMMM");
    };
    daysInMonth = () => {
        return this.state.dateContext.daysInMonth();
    };
    currentDate = () => {
        return this.state.dateContext.get("date");
    };
    currentDay = () => {
        return this.state.dateContext.format("D");
    };

    firstDayOfMonth = () => {
        let dateContext = this.state.dateContext;
        let firstDay = moment(dateContext).startOf('month').format('d');
        return firstDay;
    };

    daysInMonth = (month, year) => {
      return new Date(year, month, 0).getDate();
    };

    setMonth = (month) => {
        let monthNo = this.months.indexOf(month);
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set("month", monthNo);
        this.setState({
            dateContext: dateContext
        });
    };

    nextMonth = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).add(1, "month");
        this.setState({
            dateContext: dateContext
        });
        this.props.onNextMonth && this.props.onNextMonth();
    };

    prevMonth = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).subtract(1, "month");
        this.setState({
            dateContext: dateContext
        });
        this.props.onPrevMonth && this.props.onPrevMonth();
    };

    onSelectChange = (e, data) => {
        this.setMonth(data);
        this.props.onMonthChange && this.props.onMonthChange();

    };

    onChangeMonth = (e, month) => {
        this.setState({
            showMonthPopup: !this.state.showMonthPopup
        });
    };

    MonthNav = () => {
        return (
            <span className="label-month"
                  onClick={(e)=> {this.onChangeMonth(e, this.month())}}>
                {this.month()}
                {this.state.showMonthPopup &&
                <this.SelectList data={this.months} />
                }
            </span>
        );
    };

    showYearEditor = () => {
        this.setState({
            showYearNav: true
        });
    };

    YearNav = () => {
        return (
            this.state.showYearNav ?
                <input
                    defaultValue = {this.year()}
                    className="editor-year"
                    ref={(yearInput) => { this.yearInput = yearInput}}
                    type="number"
                    placeholder="year"/>
                :
                <span
                    className="label-year"
                    onDoubleClick={(e)=> { this.showYearEditor()}}>
                {this.year()}
            </span>
        );
    };

    render() {
        let weekdays = this.weekdaysShort.map((day) => {
            return (
                <td key={day} className="week-day">{day}</td>
            )
        });

        var firstBlanks = [];
        if(this.state.firstDay <= 31 && this.state.firstDay > 0) {

            for (let i = 0; i < this.firstDayOfMonth(); i++) {
                firstBlanks.push(<td key={i * 80} className="empty-slot">
                        {""}
                    </td>
                );
            }

            for (let i = 1; i < this.state.firstDay; i++) {
                firstBlanks.push(<td key={i * 90} className="empty-slot">
                        {""}
                    </td>
                );
            }

        }

        // console.log("first blanks: ", firstBlanks);

        let daysInMonth = [];
        let dateObj = this.state.startDate;
        for (let d = this.state.firstDay; d <= this.state.lastDay; d++) {

            dateObj.setDate(dateObj.getDate() + 1);
            let className;
            if(dateObj.getDay() === 0 || dateObj.getDay() === 6){
                className = "week-end-day";
            } else {
                className = "day";
            }

            daysInMonth.push(
                <td key={d} className={className}>
                    <span>{d}</span>
                </td>
            );
        }

        let lastBlanks = [];
        // console.info('month: ', dateObj.getUTCMonth());
        // console.info('first of last blanks: ', dateObj.getUTCDate());
        // console.info('days in month: ', this.daysInMonth(dateObj.getUTCMonth() + 1, dateObj.getUTCFullYear()));
        let lastBlanksSlot = this.daysInMonth(dateObj.getUTCMonth() + 1, dateObj.getUTCFullYear()) - (dateObj.getUTCDate() - 1);
        console.info('last blanks slot: ', lastBlanksSlot);
        if(lastBlanksSlot > 0) {
            for (let i = 0; i <= lastBlanksSlot; i++) {
                lastBlanks.push(<td key={i * 85} className="empty-slot">
                        {""}
                    </td>
                );
            }
        }

        let totalSlots = [...firstBlanks, ...daysInMonth, ...lastBlanks];
        let rows = [];
        let cells = [];


        totalSlots.forEach((row, i) => {
            if ((i % 7) !== 0) {
                cells.push(row);
            } else {
                let insertRow = cells.slice();
                rows.push(insertRow);
                cells = [];
                cells.push(row);
            }
            if (i === totalSlots.length - 1) {
                let insertRow = cells.slice();
                rows.push(insertRow);
            }
        });

        let trElems = rows.map((d, i) => {
            return (
                <tr key={i*100}>
                    {d}
                </tr>
            );
        });

        /*

        console.log("blanks: ", blanks);

        let daysInMonth = [];
        for (let d = 1; d <= this.daysInMonth(); d++) {
            let className = (d === this.currentDay() ? "day current-day": "day");
            daysInMonth.push(
                <td key={d}>
                    <span>{d}</span>
                </td>
            );
        }


        console.log("days: ", daysInMonth);

        var totalSlots = [...blanks, ...daysInMonth];
        let rows = [];
        let cells = [];

        totalSlots.forEach((row, i) => {
            if ((i % 7) !== 0) {
                cells.push(row);
            } else {
                let insertRow = cells.slice();
                rows.push(insertRow);
                cells = [];
                cells.push(row);
            }
            if (i === totalSlots.length - 1) {
                let insertRow = cells.slice();
                rows.push(insertRow);
            }
        });

        let trElems = rows.map((d, i) => {
            return (
                <tr key={i*100}>
                    {d}
                </tr>
            );
        });
        */

        return (
            <div className="calendar-container">
                <table className="calendar">
                    <thead>
                    <tr className="calendar-week-days">
                        {weekdays}
                    </tr>
                    <tr className="calendar-header">
                        <td colSpan="30">
                            <this.MonthNav />
                            {" "}
                            <this.YearNav />
                        </td>
                        <td colSpan="2" className="nav-month">
                            <i className="prev fa fa-fw fa-chevron-left"
                               onClick={(e)=> {this.prevMonth()}}>
                            </i>
                            <i className="prev fa fa-fw fa-chevron-right"
                               onClick={(e)=> {this.nextMonth()}}>
                            </i>

                        </td>
                    </tr>
                    </thead>
                    <tbody>
                    {trElems}
                    </tbody>
                </table>

            </div>

        );
    }
}