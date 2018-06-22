const baseUrl = "https://m-tracker-app.herokuapp.com/api/v2";

export const get = (endpoint, token) => {
  return fetch(`${baseUrl}${endpoint}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json"
    }
  }).then(res => res.json());
};

export const post = (endpoint, data, token = null) => {
  return fetch(`${baseUrl}${endpoint}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json"
    }
  });
};

export const put = (endpoint, data, token) => {
  return fetch(`${baseUrl}${endpoint}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json"
    }
  }).then(res => res.json());
};

export const remove = (endpoint, data, token) => {
  return fetch(`${baseUrl}${endpoint}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json"
    }
  }).then(res => res.json());
};
