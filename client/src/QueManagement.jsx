import React, { useState, useEffect } from 'react';
import { SERVICES_MOCK, COUNTERS_MOCK, TICKETS_MOCK } from './data_mock.js'
import Counter from './components/Counter.jsx'
import Timer from './components/Timer.jsx'
//prova

function QueueManagement() {
  // const [count, setCount] = useState(0)
  // const [services, setServices] = useState([])
  // const [counters, setCounters] = useState([])
  // const [tickets, setTickets] = useState([])
  // const [totalServices, setTotalServices] = useState(0)
  //const [currentTicket, setCurrentTicket] = useState(null)
  const [isCounter, setIsCounter] = useState(false)
  const [isTicket, setIsTicket] = useState(false)

  const buttonDisplay = isTicket ? 'none' : 'initial';


  const GetTicket = () => {
    setIsTicket(isTicket => !isTicket)
    
    
  }

  const serveNext = (counterId) => {
    console.log('serveNext', counterId)
  }



  return (
    <div className="fullscreen-container">
        <div className="queue">
          <h1>Queue Management System</h1>
          <div className="service-selection" style={{display:buttonDisplay}}>
            <label htmlFor="serviceName">Select Service:</label>
            <select id="serviceName" className="form-control">
              {SERVICES_MOCK.map((service) =>{
                return <option key={service.name} value={service.name}>{service.name}</option>
              } )}
            </select>
            <button onClick={GetTicket}  className="btn">Get Ticket</button>
          </div>
          {isTicket ? <div className="new-customer-info">
            <h3>Your Estimated Waiting Time is : <Timer duration={10}/> minutes</h3>
            <h3>Your Ticket Number is : <span id="ticketNumber">{TICKETS_MOCK[0].id}</span> In Queue for {SERVICES_MOCK[0].name}<span></span></h3>
            
          </div>: ''}
          
          <div className="counters" id="counters">
          {COUNTERS_MOCK.map((counter) => {
            const counter_tickets = TICKETS_MOCK.filter(ticket => ticket.counter === counter.id)
            return(
              <Counter key={counter.id} counter={counter} tickets={counter_tickets} isCounter={isCounter} serveNext={serveNext}/>
            )
          })}
          </div>
          <div className="total-services">
            <h3 className="new-customer-info">Total Services Given Today: <span id="totalServices">0</span></h3>
          </div>
        </div>
      </div>)
}

export default QueueManagement;
