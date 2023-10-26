/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';

function CounterSelectable({counter , selectMode}) {
  const [selected, setSelected] = useState(false);
  console.log("counter " + (selected && selectMode?" counter-selected":""))
  if (!selectMode && selected) {
    setSelected(false);
  }
  return (
    <div className={(selected && selectMode?" counter-selected":"counter-unselected")}
        style={{animation: selectMode&&!selected?"trembling 0.3s ease infinite":"none"}}
        onClick={() => setSelected(!selected && selectMode)}>
        <FontAwesomeIcon className="counter-icon" icon={faUser} />
        <div className="counter-number"style={{fontSize:'20px', marginTop: '20px'}}>{counter.counterId}</div>
    </div>
  )
}

export default CounterSelectable;