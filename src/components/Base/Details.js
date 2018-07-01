import api from "../utils/api";
import { redirect } from "../utils/routes";
import { detailsNodes } from "../utils/nodes";
import { Component } from "../utils/App";

class Details extends Component {
  constructor(props) {
    super(props);
    this.id = window.location.search.substr(1);
    this.elems = detailsNodes();
    this.state = {
      isAuthenticated: false,
      isFetching: false,
      isAdmin: false,
      status: 0,
      token: null
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleTokenUpdate();
    this.fetchRequest();
    this.showLoaders();
  }

  showLoaders() {
    setInterval(() => {
      this.state.isFetching &&
        (this.elems.content.innerHTML = "<h1>Getting Your Request...</h1>");
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

  handleDelete() {
    alert("Are you sure you want to delete this request?");

    this.setState({ isFetching: true });
    api
      .delete(`/users/request/${this.id}/`, this.state.token)
      .then(res => {
        this.setState({ status: res.ok });
        res.json();
      })
      .then(data => {
        this.setState({ isFetching: false });
        redirect("back");
      })
      .catch(err => console.log(err));
  }

  fetchRequest() {
    setTimeout(() => {
      const { content } = this.elems;
      if (this.state.isAuthenticated) {
        this.setState({ isFetching: true });
        api
          .get(`${this.props.uri}${this.id}/`, this.state.token)
          .then(res => {
            if (res.status === 403) {
              this.setState({ isAdmin: false });
            } else {
              this.setState({ isAdmin: true });
            }
            return res.json();
          })
          .then(data => {
            this.setState({ isFetching: false });
            if (this.state.isAdmin) {
              const hasExpired = Object.values(data).includes(
                "Token has expired"
              );
              if (hasExpired) {
                localStorage.removeItem("token");
                redirect("/auth/signin/");
              } else {
                const request = data.request;
                if (request) {
                  if (this.props.uri === "/request/") {
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
                          .update(
                            `/requests/${this.id}/approve/`,
                            this.state.token
                          )
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
                    content.innerHTML = `
                      <div class="row">
                        <div class="col-md--8 order-mb--first">
                          <h1 class="heading-lg">${request.title}</h1>
                          <p class="text text--sm mt-sm"><em>September 20, 2017</em></p>
                          <p class="text text--md mt-md">
                            ${request.description}
                          </p>
                          <div class="row mt-md flex-start">
                            <span class="badge">${request.request_type}</span>
                            <span class="badge">${request.status}</span>
                          </div>
                        </div>
                        <div class="col-md--1"></div>
                        <div class="col-md--2 mt-md fab--wrapper" id="actions"></div>
                      </div>
                    `;
                    back.addEventListener("click", () => redirect("back"));
                  }

                  if (request.status === "pending") {
                    actions.innerHTML = `
                        <a href="/requests/edit/?${this.id}" class="link">
                          <div class="fab blue">
                            <svg class="icon icon--fab">
                              <use xlink:href="../../assets/icons/sprite.svg#icon-edit-2"></use>
                            </svg>
                          </div>
                        </a>
                        <div class="fab red" id="trash">
                          <svg class="icon icon--fab">
                            <use xlink:href="../../assets/icons/sprite.svg#icon-trash"></use>
                          </svg>
                        </div>
                    `;
                    trash.addEventListener("click", this.handleDelete);
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
        redirect("/auth/signin/");
      }
    });
  }
}

export default Details;
