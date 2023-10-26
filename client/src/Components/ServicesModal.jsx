/* eslint-disable react/prop-types */
import React from 'react'
import Modal from '@mui/material/Modal';
import CounterSelectable from './CounterSelectable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { COUNTERS_MOCK, SERVICES_MOCK } from '../data_mock';
function ServicesModal({countersSet, selectMode, open, handleClose}) {

  const servicesSet = new Set();
  return (
    <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
>
    <div className='modal-div'>
      <button className="close-btn" onClick={handleClose} ><FontAwesomeIcon className='icon' icon={faXmark} /></button>
      <div className="content">
        {SERVICES_MOCK.map((service) => {return (
          <div key={service.serviceId}>
            <input type="checkbox" className="service-checkbox" id={service.serviceId} value={service.id} onChange={
              (e) => {
                if (e.target.checked) servicesSet.add(service.serviceId);
                if (!e.target.checked) servicesSet.delete(service.serviceId);
                console.log(servicesSet);
              }
            }/>
            <label className="service-label" htmlFor={service.serviceId} >{service.name}</label>
          </div>)
        })}
      </div> 
      <div className='buttons'>
        <button className="btn" disabled={!selectMode} >Add Services</button>
        <button className="btn" disabled={!selectMode} >Delete Services</button>
      </div>
    </div>
    </Modal>
  )
}

export default ServicesModal