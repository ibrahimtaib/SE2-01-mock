
const URL = 'http://localhost:3001/api'

///* API LOGIN *///

async function login(username, password) {
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
  
  async function logout() {
    await fetch(URL + '/sessions/current', {
      method: 'DELETE',
      credentials: 'include'
    });
  }
  
  async function getUserInfo() {
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

  async function getServices() {
    const response = await fetch(URL + `/services/`);
    const services = await response.json();
    if (response.ok) {
      return services;
    }
    else {
      throw services;
    }
  }

  async function getCounters() {
    const response = await fetch(URL + `/counters/`);
    const counters = await response.json();
    if (response.ok) {
      return counters;
    }
    else {
      throw counters;
    }
  }

  async function deleteService(counterID) {
    try {
      const response = await fetch('/api/delete_services', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ counterID: counterID })
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Failed to delete services');
      }
    } catch (err) {
      console.error(err);
    }
  }
  
  const API = {
    getUserInfo,
    getServices,
    getCounters,
    deleteService,
    login,
    logout
  }
  
  export default API;