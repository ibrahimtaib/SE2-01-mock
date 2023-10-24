import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  import { faUser } from '@fortawesome/free-solid-svg-icons'
//prova

  const SERVICES_MOCK = [
    {
      name: 'Customer Services',
      waitingTime: 0,
      customers: [],
      counters: [],
    },
    {
      name: 'Account',
      waitingTime: 0,
      customers: [],
      counters: [],
    },
    {
      name: 'Billing Info',
      waitingTime: 0,
      customers: [],
      counters: [],
    },
    {
      name: 'General Issues',
      waitingTime: 0,
      customers: [],
      counters: [],
    },
  ]
  
  const COUNTERS_MOCK = [
    {
      id: 1,
      service: null,
      customer: null,
    },
    {
      id: 2,
      service: null,
      customer: null,
    },
    {
      id: 3,
      service: null,
      customer: null,
    },
    {
      id: 4,
      service: null,
      customer: null,
    },
  ]  
function QueueManagement()
{
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
    <button onClick={joinQueue} className="btn">Join Queue</button>
  </div>
  <div className="new-customer-info">
    <p>Your Estimated Waiting Time is : {10} minutes</p>
  </div>
  <div className="counters" id="counters">
  {COUNTERS_MOCK.map((counter) => {
    return(
    <div key={counter.id} className="counter" id={`counter${counter.id}`}>
      <FontAwesomeIcon className="fas fa-user counter-icon" icon={faUser} />
      <div className="counter-number">{counter.id}</div>
      <div className="counter-service">{counter.service}</div>
      <button className="counter-button" onClick={()=>serveNext(counter.id)}>Serve Next</button>
    </div>)
  })}
  </div>
  <div className="total-services">
    <p>Total Services Given Today: <span id="totalServices">0</span></p>
  </div>
</div>
</div>)}

export {QueueManagement};
