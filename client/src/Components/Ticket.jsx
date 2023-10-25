/* eslint-disable react/prop-types */

function Ticket({ticket}) {
  return (
    <div className="counter-ticket">Client : {ticket.id}</div>
  )
}

export default Ticket