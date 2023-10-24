import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import Ticket from './Ticket.jsx'

function Counter({counter, tickets, serveNext}) {
  return (
    <div className="counter" id={`counter${counter.id}`}>
        <FontAwesomeIcon className="counter-icon" icon={faUser} />
        <div className="counter-number"style={{fontSize:'20px'}}>{counter.name}</div>
        <div className="counter-service">{counter.service}</div>
        <h3 >Currently Serving : </h3>
        {tickets.length > 0 ? <Ticket key={0} ticket={tickets[0]}/>  : 'No one'}
        <button disabled className="counter-button" onClick={()=>serveNext(counter.id)}>Serve Next</button>
    </div>
  )
}

export default Counter;