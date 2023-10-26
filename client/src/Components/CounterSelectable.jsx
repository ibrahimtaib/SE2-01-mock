/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';

function CounterSelectable({counter , selectMode, countersSet}) {
  const [selected, setSelected] = useState(false);
  function toggleSelected() {
    if (selected) countersSet.delete(counter);
    if (!selected) countersSet.add(counter);
    setSelected(!selected);
  }
  console.log(selectMode)
  if (!selectMode && selected) {
    setSelected(false);
    countersSet.delete(counter);
  }
  return (
    <div className={(selected && selectMode?" counter-selected":"counter-unselected")}
        style={
          {
            animation: selectMode&&!selected?"trembling 0.3s ease infinite":"none",
            pointerEvents: !selectMode?"none":"initial",
          }}
        
        onClick={toggleSelected}>
        <FontAwesomeIcon className="counter-icon" icon={faUser} />
        <div className="counter-number"style={{fontSize:'20px', marginTop: '20px'}}>{counter.counterId}</div>
    </div>
  )
}

export default CounterSelectable;