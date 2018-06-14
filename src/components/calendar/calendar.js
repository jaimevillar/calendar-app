import React from 'react';
import moment from 'moment';
import './calendar.css';

export default class Calendar extends React.Component {
    state = {
        dateContext: moment(),
        startDate: null,
        endDate: null,
        firstDay: null,
        lastDay: null,
        loading: true,
    };

    constructor(props) {
        super(props);
        this.width = props.width || "350px";
        this.style = props.style || {};
        this.style.width = this.width;
    }

    componentWillReceiveProps = (nextProps) => {
        const { startDate, endDate } = nextProps;

        this.setState({
           startDate,
           endDate,
           firstDay: new Date(startDate).getUTCDate(),
           lastDay: new Date(endDate).getUTCDate(),
        });

        if(this.state.startDate !== null &&
            this.state.endDate !== null) {
            this.setState({
               loading: false,
            });
        }

    };

    weekdaysShort = moment.weekdaysMin();

    firstDayOfMonth = (date) => {
        return moment(date).startOf('month').format('d');
    };

    daysInMonth = (month, year) => {
      return new Date(year, month, 0).getDate();
    };

    render() {
        let weekdays = this.weekdaysShort.map((day) => {
            return (
                <td key={day}>{day}</td>
            )
        });

        let firstDate = new Date(this.state.startDate);
        firstDate.setHours(firstDate.getHours() + 10);
        let lastDate = new Date(this.state.endDate);
        lastDate.setHours(lastDate.getHours() + 10);

        let monthCount = 1;
        let numMonths = numberMonths(firstDate, lastDate) ? numberMonths(firstDate, lastDate) : 1;
        let monthsData = [];
        let firstDay = this.state.firstDay;
        let lastDay = this.state.lastDay;
        let selectedMonth = firstDate.getMonth();
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        let dateObj = new Date(this.state.startDate);
        let monthObj = new Date(this.state.startDate);

        do {

            let numDaysInMonth = this.daysInMonth(monthObj.getUTCMonth() + 1, monthObj.getUTCFullYear());
            let firstDayOfMonth = this.firstDayOfMonth(monthObj);
            let firstBlanks = [];
            let daysInMonth = [];
            let lastBlanks = [];

            if(monthCount === 1){
                let firstDayNum = firstDate.getUTCDay();
                for (let i = 0; i < firstDayNum; i++) {
                    firstBlanks.push(<td key={i * 90 * monthCount} className="empty-slot">
                            {" "}
                        </td>
                    );
                }
            } else {
                for (let i = 0; i < firstDayOfMonth; i++) {
                    firstBlanks.push(<td key={i * 80 * monthCount} className="empty-slot">
                            {" "}
                        </td>
                    );
                }
            }

            if(monthCount === 1) {
                if(numMonths > 1) {
                    dateObj = new Date(this.state.startDate);
                    lastDay = numDaysInMonth;
                } else {
                    dateObj = new Date(this.state.startDate);
                    lastDay = this.state.lastDay;
                }
            } else if (monthCount === numMonths) {
                firstDay = 1;
                lastDay = this.state.lastDay;
                dateObj.setDate(0);
            } else {
                firstDay = 1;
                lastDay = numDaysInMonth;
                dateObj.setDate(0);
            }

            for (let d = firstDay; d <= lastDay; d++) {
                dateObj.setDate(dateObj.getDate() + 1);
                let className;
                if(dateObj.getDay() === 0 || dateObj.getDay() === 6){
                    className = "week-end-day";
                } else {
                    className = "day";
                }
                daysInMonth.push(
                    <td key={d} className={className}>
                        {d}
                    </td>
                );
            }


            let lastBlanksSlot = 6 - dateObj.getDay();
            if(lastBlanksSlot > 0) {
                for (let i = 0; i < lastBlanksSlot; i++) {
                    lastBlanks.push(<td key={i * 85 * monthCount} className="empty-slot">
                            {" "}
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
                    <tr key={i * monthCount}>
                        {d}
                    </tr>
                );
            });

            monthsData.push(
                <div className="calendar-month">
                    <div className="calendar-header">
                        {monthNames[selectedMonth] + " " + dateObj.getFullYear()}
                    </div>
                    <table className="calendar">
                        <tbody>
                        {trElems}
                        </tbody>
                    </table>
                </div>
            );

            dateObj.setDate(1);
            dateObj.setMonth(dateObj.getUTCMonth() + 1);
            monthObj.setMonth(monthObj.getMonth() + 1);
            monthCount++;
            selectedMonth++;
            selectedMonth = selectedMonth % 12;
        } while (monthCount <= numMonths);

        let monthElems = monthsData.map((d, i) => {
            return (
                <div key={i*500}>
                    {d}
                </div>
            );
        });

        return (
            <div className="calendar-container">
                {this.state.loading ? "Please fill the fields." :
                    <div>
                        <div className="calendar-month">
                            <table className="calendar">
                                <tbody>
                                <tr>
                                    {weekdays}
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        <div>
                            {monthElems}
                        </div>
                    </div>
                }
            </div>

        );
    }
}

function numberMonths(date1, date2) {
    let year1 = date1.getFullYear();
    let year2 = date2.getFullYear();
    let month1 = date1.getMonth();
    let month2 = date2.getMonth();
    if(month1===0){
        month1++;
        month2++;
    }

    return (year2 - year1) * 12 + (month2 - month1) + 1;
}

