import api from "./api";
import { redirect } from "./routes";
import { detailsNodes } from "./nodes";
import { Component } from "./App";

class Details extends Component {
  constructor() {
    super();
    this.id = window.location.search.substr(1);
    this.elems = detailsNodes();
    this.state = {
      isAuthenticated: false,
      isFetching: false,
      isAdmin: false,
      status: 0,
      token: null
    };
    this.handleTokenUpdate();
  }

  handleTokenUpdate() {
    setInterval(() => {
      const token = localStorage.getItem("token");
      token
        ? this.setState({ token, isAuthenticated: true })
        : this.setState({ token: null, isAuthenticated: false });
    }, 0);
  }

  fetchRequest() {
    setTimeout(() => {
      const { content } = this.elems;
      if (this.state.isAuthenticated) {
        api
          .get(`/request/${this.id}/`, this.state.token)
          .then(res => {
            if (res.status === 403) {
              this.setState({ isAdmin: false });
            } else {
              this.setState({ isAdmin: true });
            }
            return res.json();
          })
          .then(data => {
            if (this.state.isAdmin) {
              const hasExpired = Object.values(data).includes(
                "Token has expired"
              );
              if (hasExpired) {
                localStorage.removeItem("token");
                redirect("/auth/signin.html");
              } else {
                const request = data.request;
                if (request) {
                  content.innerHTML = `
                    <div class="card card--request-details">
                        <div class="card__header hr">
                            <span>${request.title}</span>
                            <div class="user-info">
                            <span>${request.user_id}</span> /
                            <span>${request.location}</span> /
                            <span>September 28th, 2017</span>
                            </div>
                        </div>
                        <div class="card__content hr">
                            <p>${request.description}</p>
                        </div>
                        <div class="card__footer">
                            <strong>
                            <em>${request.request_type}</em>
                            </strong>

                            <div class="status--details">
                            <em>${request.status}</em>
                            <div id="actions"></div>
                            </div>
                        </div>
                    </div>
                    `;

                  if (request.status === "pending") {
                    actions.innerHTML = `
                        <button class="btn btn--success" id="approve">Approve</button>
                        <button class="btn btn--danger" id="reject">Reject</button>
                   `;

                    approve.addEventListener("click", () => {
                      approve.setAttribute("disabled", "disabled");
                      reject.setAttribute("disabled", "disabled");
                      approve.innerHTML = "Approving...";
                      api
                        .update(`/requests/${id}/approve/`, this.state.token)
                        .then(res => res.json())
                        .then(data => console.log(data));
                      location.reload();
                    });
                    reject.addEventListener("click", () => {
                      reject.setAttribute("disabled", "disabled");
                      approve.setAttribute("disabled", "disabled");
                      reject.innerHTML = "Rejecting...";
                      api
                        .update(`/requests/${id}/reject/`, state.token)
                        .then(res => res.json())
                        .then(data => console.log(data));
                      location.reload();
                    });
                  } else if (request.status === "approved") {
                    actions.innerHTML = `
                        <button class="btn btn--primary" id="resolve">Resolve</button>
                    `;
                    resolve.addEventListener("click", () => {
                      resolve.setAttribute("disabled", "disabled");
                      resolve.innerHTML = "resolving...";
                      api
                        .update(
                          `/requests/${this.id}/resolve/`,
                          this.state.token
                        )
                        .then(res => res.json())
                        .then(data => console.log(data));
                      location.reload();
                    });
                  }
                } else {
                  content.innerHTML = `<h1>Request not found :(</h1>`;
                }
              }
            } else {
              redirect("/errors/403.html");
            }
          });
      } else {
        redirect("/auth/signin.html");
      }
    });
  }
}

const details = new Details();
details.fetchRequest();
