import { Component } from "../utils/App";
import { dashboardNodes } from "../utils/nodes";
import api from "../utils/api";
import { redirect } from "../utils/routes";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      isFetching: false,
      isAdmin: false,
      stats: {
        all: 0,
        pending: 0,
        approved: 0,
        resolved: 0,
        rejected: 0
      },
      status: 0,
      token: null
    };
    this.elems = dashboardNodes();
    this.handleTokenUpdate();
    this.fetchRequests();
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
    const tableHeader = `
        <div class="hr row--table table__header">
            <div class="table__data th table__data--md">Title</div>
            <div class="table__data th table__data--lg">Description</div>
            <div class="table__data th">Date</div>
            <div class="table__data th">Requester</div>
            <div class="table__data th">Type</div>
            <div class="table__data th">Status</div>
        </div>
    `;

    setTimeout(() => {
      if (this.state.isAuthenticated) {
        api
          .get("/requests/", this.state.token)
          .then(res => {
            res.status === 403
              ? this.setState({ isAdmin: false })
              : this.setState({ isAdmin: true });
            return res.json();
          })
          .then(data => {
            if (this.state.isAdmin) {
              const hasExpired = Object.values(data).includes(
                "Token has expired"
              );
              if (hasExpired) {
                localStorage.removeItem("token");
                redirect("/auth/signin/");
              } else {
                const stats = { ...this.state.stats };
                stats.all = data.requests.length;
                this.setState({ stats });
                data.requests.map(request => {
                  if (request.status === "pending") {
                    stats.pending = stats.pending + 1;
                    this.setState({ stats });
                  } else if (request.status === "approved") {
                    stats.approved = stats.approved + 1;
                    this.setState({ stats });
                  } else if (request.status === "resolved") {
                    stats.resolved = stats.resolved + 1;
                    this.setState({ stats });
                  } else if (request.status === "rejected") {
                    stats.rejected = stats.rejected + 1;
                    this.setState({ stats });
                  }
                });
                const {
                  all,
                  pending,
                  approved,
                  resolved,
                  rejected
                } = this.state.stats;

                this.elems.all.innerHTML = all;
                this.elems.pending.innerHTML = pending;
                this.elems.approved.innerHTML = approved;
                this.elems.resolved.innerHTML = resolved;
                this.elems.rejected.innerHTML = rejected;
                this.elems.content.innerHTML =
                  tableHeader +
                  data.requests.map(
                    request => `
                    <a href="details/?${request.public_id}" class="table--link">
                      <div class="hr row--table">
                      <div class="table__data table__data--md">
                        ${
                          request.title.length > 22
                            ? request.title.substr(0, 22) + "..."
                            : request.title
                        }
                      </div>
                      <div class="table__data table__data--lg">
                        ${
                          request.description.length > 40
                            ? request.description.substr(0, 40) + "..."
                            : request.description
                        }
                      </div>
                      <div class="table__data">Nov 27, 2018</div>
                      <div class="table__data">${request.user_id}</div>
                      <div class="table__data">${request.request_type}</div>
                      <div class="table__data">
                        <em>${request.status}</em>
                      </div>
                    </div>
                  </a>`
                  );
              }
            } else {
              redirect("/errors/403.html");
            }
          })
          .catch(err => console.log(err));
      } else {
        redirect("/auth/signin/");
      }
    });
  }
}
const dashboard = new Dashboard();
