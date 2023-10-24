import React from 'react'

function Ticket({ticket}) {
  return (
    <div className="counter-ticket" style={{color:'black'}}>Ticket number{ticket.id}</div>
  )
}

export default Ticket