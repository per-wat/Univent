import React from 'react';
import moment from 'moment';

const TimePeriodIndicator = (props) => {
  const { timePeriod, currentDate } = props;

  let label;
  if (timePeriod === 'Month') {
    label = moment(currentDate).format('MMMM');
  } else if (timePeriod === 'Week') {
    const start = moment(currentDate).startOf('week');
    const end = moment(currentDate).endOf('week');
    label = `${start.format('D')} - ${end.format('D MMM')}`;
  } else if (timePeriod === 'Day') {
    label = moment(currentDate).format('YYYY-MM-DD');
  }

  return <div className="indicator">{label}</div>;
};

export default TimePeriodIndicator;
