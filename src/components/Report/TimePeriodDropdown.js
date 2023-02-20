import React, { useState } from 'react';
import Dropdown from 'react-dropdown';
//npm install react-dropdown
import './Dropdown.css'
//custom css can refer to these 2 websites
//https://www.npmjs.com/package/react-dropdown?activeTab=readme
//https://www.npmjs.com/package/react-dropdown?activeTab=explore
import 'react-dropdown/style.css';

const timePeriodOptions = ['Month', 'Week', 'Day'];

const TimePeriodDropdown = (props) => {
  const [selectedOption, setSelectedOption] = useState(timePeriodOptions[0]);

  const onChange = (option) => {
    setSelectedOption(option);
    props.onTimePeriodChange(option.value);
  };

  return (
    <Dropdown
      options={timePeriodOptions}
      onChange={onChange}
      value={selectedOption}
      controlClassName='dropdown-box'
      menuClassName='dropdown-menu'
      arrowClassName='dropdown-arrow'
    />
  );
};

export default TimePeriodDropdown;
