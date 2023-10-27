/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal';
import CounterSelectable from './CounterSelectable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { COUNTERS_MOCK, SERVICES_MOCK } from '../data_mock';
import API from '../API';

//TODO: The function is made to add or delete services for counters * ///

async function manageServicesOfCounters(servicesSet, countersSet, deleteTrue) {
  console.log(servicesSet);
  console.log(countersSet);
  
  //TODO: post request to backend
  const servicesArray = Array.from(servicesSet);
  const countersArray = Array.from(countersSet);
  const apiObj = { counters: countersArray, services: servicesArray };

  if (deleteTrue) {
    //api call to delete services from counters
    await API.deleteServicesToCounters(countersArray, servicesArray)
  } else {
    //api call to add services to counters
    await API.addServicesToCounters(countersArray, servicesArray)
  }
  return;
} 


function ServicesModal({ counters, services, selectMode, open, handleClose }) {
  const servicesSet = new Set();
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className='modal-div'>
        <h1>Select services to add/delete to the counters</h1>
        <button className="close-btn" onClick={handleClose} ><FontAwesomeIcon className='icon' icon={faXmark} /></button>
        <div className="content">
          {services.map((service) => {
            return (
              <div key={service.serviceId}>
                <input type="checkbox" className="service-checkbox" id={service.serviceId} value={service.id} onChange={
                  (e) => {
                    if (e.target.checked) servicesSet.add(e.value);
                    if (!e.target.checked) servicesSet.delete(service.serviceId);
                    console.log(servicesSet);
                  }
                } />
                <label className="service-label" htmlFor={service.serviceId} >{service.name}</label>
              </div>)
          })}
        </div>
        <div className='buttons'>
          <button className="btn" disabled={!selectMode}  onClick={manageServicesOfCounters(...{ countersSet, servicesSet }, true)} >Add Services</button>
          <button className="btn" disabled={!selectMode}  onClick={manageServicesOfCounters(...{ countersSet, servicesSet }, false)} >Delete Services</button>
        </div>
      </div>
    </Modal>
  )
}

export default ServicesModal