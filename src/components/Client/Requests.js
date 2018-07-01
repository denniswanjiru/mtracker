import api from "../utils/api";
import { Component } from "../utils/App";
import { redirect } from "../utils/routes";
import { requestsNodes } from "../utils/nodes";

class Requests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      isFetching: false,
      success: null,
      status: 0,
      token: null
    };
    this.elems = requestsNodes();
    this.handleTokenUpdate();
    this.fetchRequests();
    this.showLoaders();
  }

  showLoaders() {
    setInterval(() => {
      this.state.isFetching &&
        (this.elems.root.innerHTML = "<h1>Getting Your Requests...</h1>");
    }, 0);
  }

  handleTokenUpdate() {
    setInterval(() => {
      const token = localStorage.getItem("token");
      token
        ? this.setState({ token, isAuthenticated: true })
        : this.setState({ token: null, isAuthenticated: false });
    }, 0);
  }

  fetchRequests() {
    const [root, total, filters] = Object.values(this.elems);
    setTimeout(() => {
      if (this.state.isAuthenticated) {
        this.setState({ isFetching: true });
        api
          .get("/users/requests/", this.state.token)
          .then(res => {
            this.setState({
              success: res.ok,
              status: res.status
            });
            return res.json();
          })
          .then(data => {
            this.setState({ isFetching: false });
            if (this.state.success) {
              total.innerHTML = `(${data.requests.length})`;
              filters.classList.remove("hidden");
              root.innerHTML = data.requests.map(
                request => `
                <div class="col col--3">
                    <a href="view/?${request.public_id}" class="link">
                      <div class="card card--request">
                      <div class="card__header hr">
                          <h1>${request.title}</h1>
                          <p class="date">Sep 20th</p>
                      </div>
                      <div class="card__content hr">
                          <p>
                          ${
                            request.description.length > 84
                              ? request.description.substr(0, 84) + "..."
                              : request.description
                          }
                        </p>
                      </div>
                      <div class="card__footer">
                          <em>${request.request_type}</em>
                          <span class="status status--${request.status}">
                          <p>${request.status}</p>
                          </span>
                      </div>
                      </div>
                    </a>
                </div>
            `
              );
            } else {
              if (this.state.status === 404) {
                root.innerHTML = `
                  <h1>
                    ${data.message}. Make a new request
                    <a href="http://127.0.0.1:8080/requests/new/">here</a>
                  </h1>`;
              } else {
                const hasExpired = Object.values(data).includes(
                  "Token has expired"
                );
                if (hasExpired) {
                  localStorage.removeItem("token");
                  redirect("/auth/signin/");
                }
              }
            }
          });
      } else {
        redirect("/auth/signin/");
      }
    }, 0);
  }
}

const requests = new Requests();
