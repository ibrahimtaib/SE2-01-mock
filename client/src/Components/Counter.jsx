/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import Ticket from './Ticket.jsx'

function Counter({counter , CurrentTicket, isCounter, serveNext}) {
  const display = isCounter ? 'initial' : 'none';
  return (
    <div className="counter" id={`counter${counter.id}`}>
        <FontAwesomeIcon className="counter-icon" icon={faUser} />
        <div className="counter-number"style={{fontSize:'20px'}}>{counter.name}</div>
        <div className="counter-service">{counter.service}</div>
        <h3 >Currently Serving : </h3>
        {CurrentTicket !== null? <Ticket key={0} id={CurrentTicket}/>  : <div style={{color:'black'}}>No one</div>}
        <button className="counter-button" style={{display:display}}  onClick={()=>serveNext(counter.id)}>Serve Next</button>
    </div>
  )
}

export default Counter;