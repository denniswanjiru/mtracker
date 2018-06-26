class Api {
  constructor() {
    this.baseUrl = "https://m-tracker-app.herokuapp.com/api/v2";
  }

  get(endpoint, token) {
    return fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json"
      }
    });
  }

  post(endpoint, data, token = null) {
    return fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json"
      }
    });
  }

  update(endpoint, token, data = null) {
    return fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json"
      }
    });
  }

  delete(endpoint, data, token) {
    return fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json"
      }
    });
  }
}
const api = new Api();
export default api;
