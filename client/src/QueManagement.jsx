import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { SERVICES_MOCK, COUNTERS_MOCK, TICKETS_MOCK } from './data_mock.js'
import Counter from './components/Counter.jsx'
//prova

function QueueManagement() {
  // const [count, setCount] = useState(0)
  // const [services, setServices] = useState([])
  // const [counters, setCounters] = useState([])


  const joinQueue = () => {
    console.log('joinQueue')
  }

  const serveNext = (counterId) => {
    console.log('serveNext', counterId)
  }
  return (
    <div className="fullscreen-container">
        <div className="queue">
          <h1>Queue Management System</h1>
          <div className="service-selection">
            <label htmlFor="serviceName">Select Service:</label>
            <select id="serviceName" className="form-control">
              {SERVICES_MOCK.map((service) =>{
                return <option key={service.name} value={service.name}>{service.name}</option>
              } )}
            </select>
            <button onClick={joinQueue} className="btn">Get Ticket</button>
          </div>
          <div className="new-customer-info">
            <p>Your Estimated Waiting Time is : {10} minutes</p>
          </div>
          <div className="counters" id="counters">
          {COUNTERS_MOCK.map((counter) => {
            const counter_tickets = TICKETS_MOCK.filter(ticket => ticket.counter === counter.id)
            return(
              <Counter key={counter.id} counter={counter} tickets={counter_tickets} serveNext={serveNext}/>
            )
          })}
          </div>
          <div className="total-services">
            <p>Total Services Given Today: <span id="totalServices">0</span></p>
          </div>
        </div>
      </div>)
}

export default QueueManagement;
