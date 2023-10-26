
const URL = 'http://localhost:3001/api'

///* API LOGIN *///

export async function login(username, password) {
    let response = await fetch(URL + '/sessions', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username, password: password }),
    });
    if (response.ok) {
      const user = await response.json();
      return user;
    } else {
      const errDetail = await response.json();
      throw errDetail.message;
    }
  }
  
  export async function logout() {
    await fetch(URL + '/sessions/current', {
      method: 'DELETE',
      credentials: 'include'
    });
  }
  
  export async function getUserInfo() {
    const response = await fetch(URL + '/sessions/current', {
      credentials: 'include'
    });
    const userInfo = await response.json();
    if (response.ok) {
      return userInfo;
    } else {
      throw userInfo;
    }
  }

  export async function getTicket(serviceId){
    const response = await fetch(URL+'/api/tickets',{
        method:'POST',
        credentials:'include',
        body: JSON.stringify({ serviceId }),
    })
    const ticket = response.json();
    if (response.ok) {
        return ticket;
      } else {
        throw ticket;
      }

  }

  export async function getServices(){
    const response = await fetch(URL+'/api/services',{
        method:'GET',
        credentials:'include'
    })
    const services = response.json();
    if (response.ok) {
        return services;
      } else {
        throw services;
      }

  }

  export async function getCounters(){
    const response = await fetch(URL+'/api/counters',{
        method:'GET',
        credentials:'include'
    })
    const counters = response.json();
    if (response.ok) {
        return counters;
      } else {
        throw counters;
      }

  }

  export async function getNextCostumer(counterId){
    const response = await fetch(URL+'/api/next',{
        method:'POST',
        credentials:'include',
        body: JSON.stringify({ counterId }),
    })
    const services = response.json();
    if (response.ok) {
        return services;
      } else {
        throw services;
      }
  }