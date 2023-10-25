export const SERVICES_MOCK = [
    {
      id: 1,
      name: 'Customer Services',
      waitingTime: 0,
      customers: [],
      counters: [],
    },
    {
      id: 2,
      name: 'Account',
      waitingTime: 0,
      customers: [],
      counters: [],
    },
    {
      id: 3,
      name: 'Billing Info',
      waitingTime: 0,
      customers: [],
      counters: [],
    },
    {
      id: 4,
      name: 'General Issues',
      waitingTime: 0,
      customers: [],
      counters: [],
    },
  ]
  
export  const COUNTERS_MOCK = [
    {
      id: 1,
      services: [1,2],
      name: 'Fabio',
      currentTicketId:1,
    },
    {
      id: 2,
      services: [2,4],
      name: 'Sara',
      currentTicketId:2,
    },
    {
      id: 3,
      services: [3,1],
      name: 'John',
      currentTicketId:3,
    },
    {
      id: 4,
      services: [4,1],
      name: 'Mary',
      currentTicketId:4,
    },
  ]
export  const TICKETS_MOCK = [
    {id: 1, service: 3},
    {id: 2, service: 1},
    {id: 3, service: 2}, 
    {id: 4, service: 4},
    {id: 5, service: 3},
    {id: 6, service: 1},
    {id: 7, service: 2}, 
    {id: 8, service: 4},
    {id: 9, service: 3},
    {id: 10, service: 1},
    {id: 11, service: 2}, 
    {id: 12, service: 4},
    {id: 13, service: 3},
    {id: 14, service: 1},
    {id: 15, service: 2}, 
    {id: 16, service: 4},
    {id: 17, service: 3},
    {id: 18, service: 1},
    {id: 19, service: 2}, 
    {id: 20, service: 4},
    {id: 21, service: 3},
    {id: 22, service: 1},
    {id: 23,service: 2}
  ]