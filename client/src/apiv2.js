import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3001/',
  withCredentials: true
});

///* API LOGIN *///

export async function login(username, password) {
    let response = await api.post('/sessions', { username, password });
    if (response.ok) {
      const user = await response.json();
      return user;
    } else {
      const errDetail = await response.json();
      throw errDetail.message;
    }
  }
  
  export async function logout() {
    await api.delete('/sessions/current')
  }
  
  export async function getUserInfo() {
    const response = await api.get('/sessions/current');
    const userInfo = await response.json();
    if (response.ok) {
      return userInfo;
    } else {
      throw userInfo;
    }
  }

  export async function getTicket(serviceId){
    const response = await api.post('/api/tickets',{ serviceId });
    const ticket = response.json();
    if (response.ok) {
        return ticket;
      } else {
        throw ticket;
      }

  }

  export async function getServices(){
    const response = await api.get('/api/services')
    const services = response.json();
    if (response.ok) {
        return services;
      } else {
        throw services;
      }

  }

  export async function getCounters(){
    const response = await api.get('/api/counters')
    const counters = response.json();
    if (response.ok) {
        return counters;
      } else {
        throw counters;
      }

  }

  export async function getNextCostumer(counterId){
    const response = await api.post('/api/next',{ counterId });
    const services = response.json();
    if (response.ok) {
        return services;
      } else {
        throw services;
      }
}


export default api;