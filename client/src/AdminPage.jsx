import React from 'react'
import { useState } from 'react';
import Modal from '@mui/material/Modal';
import CounterSelectable from './Components/CounterSelectable';
import { COUNTERS_MOCK } from './data_mock';
function AdminPage() {
  const [selectMode, toggleSelectMode] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const countersSet = new Set();

  return (
    <div className='fullscreen-container'>
      <div className='admin-system'>
        <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
        >
          <div className='modal-div'>
            {COUNTERS_MOCK.map((counter) => <CounterSelectable key={counter.counterId} counter={counter} selectMode={selectMode} countersSet={countersSet}/>)}
          </div>
        </Modal>
        <h1>Administration System</h1>
        <button className="btn" disabled={!selectMode} onClick={handleOpen} >Add Services</button>
        <button className="btn" disabled={!selectMode} >Delete Services</button>
        <button className="btn" 
          onClick={() => {toggleSelectMode(!selectMode)}}
          style={{backgroundColor: selectMode?'#4CAF50':''}}
          >Select Mode</button>
        <div className='counters-div'>
        {COUNTERS_MOCK.map((counter) => <CounterSelectable key={counter.counterId} counter={counter} selectMode={selectMode} countersSet={countersSet}/>)}
        </div>
      </div>
    </div>
  )
}

export default AdminPage