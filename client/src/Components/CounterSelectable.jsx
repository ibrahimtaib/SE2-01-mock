/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';
import Tooltip from '@mui/material/Tooltip'

function CounterSelectable({counter , services, selectMode, countersSet}) {
  const [selected, setSelected] = useState(false);
  function toggleSelected() {
    if (!selectMode) return;
    if (selected) countersSet.delete(counter);
    if (!selected) countersSet.add(counter);
    setSelected(!selected);
  }
  //console.log(selectMode)
  if (!selectMode && selected) {
    setSelected(false);
    countersSet.delete(counter);
  }
  return (
    <div className={(selected && selectMode?"counter-selected":"counter-unselected")}
        style={
          {
            animation: selectMode&&!selected?"trembling 0.3s ease infinite":"none",
            cursor: !selectMode?"initial":"pointer",
          }}
        
        onClick={toggleSelected}>
          <Tooltip className='tooltip' title={services.filter((service) => service.serviceId in counter.services).join(", ")}>
            <FontAwesomeIcon className='info-icon' icon={faCircleInfo} />
          </Tooltip>
        <FontAwesomeIcon className="counter-icon" icon={faUser} />
        <div className="counter-number"style={{fontSize:'20px', marginTop: '20px'}}>{counter.counterId}</div>
    </div>
  )
}

export default CounterSelectable;