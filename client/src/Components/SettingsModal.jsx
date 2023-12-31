/* eslint-disable react/prop-types */
import React from 'react'
import { useState } from 'react';
import Modal from '@mui/material/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { SERVICES_MOCK } from '../data_mock';
import API from '../API';


function SettingsModal(props) {
  const servicesSet = new Set();
  const serviceInput = React.useRef(null);
  const [newService, setNewService] = React.useState();
  const [servicesToDelete, setServicesToDelete] = React.useState([]);

  function deleteServices(servicesToDelete) {
    //if service to delete is empty display alert
    //if not cycle this Set (service to delete is a set) and do a post request to API.deleteServices()
    const servToDeleteArray = Array.from(servicesToDelete);

    console.log(servToDeleteArray);

    if (servToDeleteArray.length == 0) {
      alert("Empty set of services detected!");
    }
    else {
      //TODO: FIX THIS
      servToDeleteArray.map((service) => {
        API.deleteService(service.serviceID)
          .then(() => {
            API.getServices()
              .then((services) => {
                props.setServices(services);
              });
          })
          .catch((err) => console.log(err));

      });
    }


  }

  function postNewService(serviceInput) {
    if (serviceInput == null) {
      alert('An error occurred, please refresh the page');
      return;
    }
    if (serviceInput.trim() === '') {
      alert('Service name can\'t be empty');
      return;
    }
    const serviceName = serviceInput.trim();
    API.postService(serviceInput)
      .then(() => {
        API.getServices()
          .then((services) => {
            props.setServices(services);
          });
      })
      .catch((err) => console.log(err));

  }


  return (
    <Modal
      open={props.openSettings}
      onClose={props.handleCloseSettings}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className='modal-div'>
        <button className="close-btn" onClick={props.handleCloseSettings} ><FontAwesomeIcon className='icon' icon={faXmark} /></button>
        <div className="content">
          {props.services.map((service) => {
            return (
              <div key={service.serviceId}>
                <input type="checkbox" className="service-checkbox" id={service.serviceId} value={service.id} onChange={
                  (e) => {
                    if (e.target.checked) servicesSet.add(service);
                    if (!e.target.checked) servicesSet.delete(service);
                    //console.log(servicesSet); Working!
                  }
                } />
                <label className="service-label" htmlFor={service.serviceId} >{service.name}</label>
              </div>)
          })}
        </div>
        <div className='buttons'>
          <button className="btn" onClick={() => deleteServices(servicesSet)}>Delete Services</button>
        </div>
        <div className="add-service-div">
          <input ref={serviceInput} type="text" className="add-service-input" onChange={event => { setNewService(event.target.value); }} placeholder="Service name" />
          <button className="btn" onClick={() => postNewService(newService)}>Add Service</button>
        </div>
      </div>
    </Modal>
  )
}

export default SettingsModal