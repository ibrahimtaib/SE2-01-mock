import React, { useState, useEffect } from 'react';
import { SERVICES_MOCK, COUNTERS_MOCK, TICKETS_MOCK } from './data_mock.js'
import Counter from './Components/Counter.jsx'
import Timer from './Components/Timer.jsx'
import { BrowserRouter, Routes, Route, Outlet, useNavigate, Link } from 'react-router-dom';
//prova
const MOCK_GET_NEXT_CUSTOMER = {
  ticketId: 5,
}

function QueueManagement(props) {
  const navigate = useNavigate();
  // const [count, setCount] = useState(0)
  // TODO: Set states with database entries in App.jsx
  const [services, setServices] = useState(SERVICES_MOCK)
  const [counters, setCounters] = useState(COUNTERS_MOCK)
  const [responseCounter, setResponseCounter] = useState(1)
  const [selectedService, setSelectedService] = useState(services[0].name)
  const [currentTicket, setCurrentTicket] = useState(TICKETS_MOCK[0])
  const [isCounter, setIsCounter] = useState(false)
  const [isTicket, setIsTicket] = useState(false)
  const [isMyturn, setIsMyturn] = useState(false)

  const buttonDisplay = isTicket || isCounter ? 'none' : 'flex';


  const GetTicket = (selectedService) => {
    setTimeout(() => {
      const serviceId = services.find((service) => service.name === selectedService).id

      //call getTicket from server with selectedService.id
      const response = { id: 5, service: 3 }
      setIsTicket(isTicket => !isTicket)
      setCurrentTicket(response)
      console.log('currentTicket', currentTicket)
    }, 2000)
  }

  const serveNext = async (counterId) => {

    setResponseCounter(counterId)
    // call getNextCostumer from server
    setTimeout(() => {
      const response = MOCK_GET_NEXT_CUSTOMER
      const updatedCounters = counters.map((counter) => {
        if (counter.id === counterId) {
          counter.currentTicketId = response.ticketId
        }
        return counter
      })
      setCounters(updatedCounters)
      // check if it's my turn
      setIsMyturn(response.ticketId === currentTicket.id)
    }, 2000)




  }


  // FIXME: What is this for?
  useEffect(() => {
    console.log('isTicket', isTicket)
  }, [isTicket])


  return (
    <div className="fullscreen-container">
      <div className="queue">
        <h2>Queue Management System</h2>
        {/*<button onClick={()=>setIsMyturn(isMyturn => !isMyturn)} className="btn">MyTurn</button>*/}
        <button style={{ position: 'relative', right: -400, top: -90 }} onClick={() => setIsCounter(isCounter => !isCounter)} className="btn">Switch</button>
        <div className="service-selection" style={{ display: buttonDisplay }}>
          <label htmlFor="serviceName">Select Service:</label>
          <select id="serviceName"
            className="form-control"
            onChange={(e) => setSelectedService(e.target.value)}>
            {services.map((service) => {
              return <option key={service.name} value={service.name}>{service.name}</option>
            })}
          </select>
          <button onClick={() => GetTicket(selectedService)} className="btn">Get Ticket</button>
        </div>
        {isTicket && !isMyturn ?
          <div className="new-customer-info">
            <h3>Your Estimated Waiting Time is : <Timer duration={10} /> minutes</h3>
            <h3>Your Ticket Number is : <span id="ticketNumber">{currentTicket.id}</span> In Queue for {selectedService} </h3>
          </div> : isMyturn ?
            <div>
              <h1>It is your turn!</h1>
              <h1>Go to counter {responseCounter}</h1>
            </div> :
            <div></div>
        }

        <div className="counters" id="counters">
          {counters.map((counter) => {
            return (
              <Counter key={counter.id} counter={counter} CurrentTicket={counter.currentTicketId} isCounter={isCounter} serveNext={serveNext} />
            )
          })}
        </div>
        <div className="total-services">
          <h3 className="new-customer-info">Total Services Given Today: <span id="totalServices">0</span></h3>
          {props.loggedIn ? <><h3 className="new-customer-info">Logged User: <span id="totalServices">{props.user.username} - {props.user.role}</span></h3></> : ''}
        </div>
      </div>
    </div>
  )
}

export default QueueManagement;
