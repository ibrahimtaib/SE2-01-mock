import React from 'react'
import { useState, useEffect } from 'react';
import CounterSelectable from './Components/CounterSelectable';
// import { COUNTERS_MOCK } from './data_mock';
import ServicesModal from './Components/ServicesModal';
import SettingsModal from './Components/SettingsModal';
import API from './API';
// import api from './apiv2';
function AdminPage() {
  const [selectMode, toggleSelectMode] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [services,setServices] = useState([]);
  const [counters,setCounters] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const countersSet = new Set();

  

  // modal to add/delete services from database
  const [openSettings, setOpenSettings] = React.useState(false);
  const handleOpenSettings = () => setOpenSettings(true);
  const handleCloseSettings = () => setOpenSettings(false);

  useEffect(() => {
    API.getServices()
      .then((services) => {
        setServices(services);
      });

      API.getCounters()
      .then((counters) => {
        setCounters(counters);
      });
  }, []);

  //

  return (
    <div className='fullscreen-container'>
      <div className='admin-system'>
        <ServicesModal 
          counters={counters} 
          services={services}
          selectMode={selectMode}
          open={open}
          handleClose={handleClose}
          />
          <SettingsModal
            services={services}
            setServices={setServices}
            openSettings={openSettings}
            handleCloseSettings={handleCloseSettings}
          />
        <h1>Administration System</h1>
        <button className="settings-button" disabled={selectMode} onClick={handleOpenSettings} >Manage Services</button>
        <button className="btn" disabled={!selectMode} onClick={handleOpen} >Select Services</button>
        <button className="btn" 
          onClick={() => {toggleSelectMode(!selectMode)}}
          style={{backgroundColor: selectMode?'#4CAF50':''}}
          >Configure Counters</button>
        <div className='counters-div'>
        {counters.map((counter) => <CounterSelectable key={counter.counterId} counter={counter} selectMode={selectMode} countersSet={countersSet}/>)}
        </div>
      </div>
    </div>
  )
}

export default AdminPage