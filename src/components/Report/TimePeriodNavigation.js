import React from 'react';
import moment from 'moment';
import './Navigation.css';
//npm install moment

const TimePeriodNavigation = (props) => {
  const { timePeriod, currentDate, onDateChange } = props;

  const previous = () => {
    let previousDate;
    if (timePeriod === 'Month') {
      previousDate = moment(currentDate).subtract(1, 'month');
    } else if (timePeriod === 'Week') {
      previousDate = moment(currentDate).subtract(1, 'week');
    } else if (timePeriod === 'Day') {
      previousDate = moment(currentDate).subtract(1, 'day');
    }
    onDateChange(previousDate.toDate());
  };
  

  const next = () => {
    let nextDate;
    if (timePeriod === 'Month') {
      nextDate = moment(currentDate).add(1, 'month');
    } else if (timePeriod === 'Week') {
      nextDate = moment(currentDate).add(1, 'week');
    } else if (timePeriod === 'Day') {
      nextDate = moment(currentDate).add(1, 'day');
    }
    onDateChange(nextDate.toDate());
  };
  

  return (
    <div className="navigation">
      <button onClick={previous}>Previous</button>
      <button onClick={next}>Next</button>
    </div>
  );
};

export default TimePeriodNavigation;
