import React from 'react'
import { useRef } from 'react';
import { useState } from 'react';
import CounterSelectable from './Components/CounterSelectable';
import { COUNTERS_MOCK } from './data_mock';
function AdminPage() {
  const [selectMode, toggleSelectMode] = useState(false);
  console.log(selectMode)
  return (
    <div className='fullscreen-container'>
      <div className='admin-system'>
        <h1>Administration System</h1>
        <button className="btn" disabled={!selectMode} >Add Services</button>
        <button className="btn" disabled={!selectMode} >Delete Services</button>
        <button className="btn" 
          onClick={() => {toggleSelectMode(!selectMode)}}
          style={{backgroundColor: selectMode?'#4CAF50':''}}
          >Select Mode</button>
        <div className='counters-div'>
        {COUNTERS_MOCK.map((counter) => <CounterSelectable key={counter.counterId} counter={counter} selectMode={selectMode}/>)}
        </div>
      </div>
    </div>
  )
}

export default AdminPage