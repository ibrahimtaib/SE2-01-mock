/* eslint-disable react/prop-types */
import React from 'react'
import Modal from '@mui/material/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { SERVICES_MOCK } from '../data_mock';
function postNewService(serviceInput, servicesSet) {
  console.log(servicesSet);
  if (serviceInput.current == null) {
    alert('An error occurred, please refresh the page');
    return;
  } 
  if (serviceInput.current.value.trim() === '') {
    alert('Service name can\'t be empty');
    return;
  }
  const serviceName = serviceInput.current.value.trim();
  // TODO: post new services to server
}
function deleteServices(servicesSet) {
  console.log(servicesSet);
  const serviceIdArray = Array.from(servicesSet);
  //TODO: delete services from server
}
function SettingsModal({openSettings, handleCloseSettings}) {
  const servicesSet = new Set();
  const serviceInput = React.useRef(null);
  return (
    <Modal
    open={openSettings}
    onClose={handleCloseSettings}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
>
    <div className='modal-div'>
      <button className="close-btn" onClick={handleCloseSettings} ><FontAwesomeIcon className='icon' icon={faXmark} /></button>
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
        <button className="btn" onClick={() => deleteServices(servicesSet)}>Delete Services</button>
      </div>
      <div className="add-service-div">
        <input ref={serviceInput} type="text" className="add-service-input" placeholder="Service name" />
        <button className="btn" onClick={() => postNewService(servicesSet)}>Add Service</button>
      </div>
    </div>
    </Modal>
  )
}

export default SettingsModal