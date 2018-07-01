import { Component } from "../utils/App";
import api from "../utils/api";
import { redirect } from "../utils/routes";
import { requestFormNodes } from "../utils/nodes";

class Edit extends Component {
  constructor(props) {
    super(props);
    this.id = window.location.search.substr(1);
    this.state = {
      data: {},
      status: 0,
      errors: {},
      token: null,
      success: null,
      isFetching: false,
      isAuthenticated: false
    };
    this.submit = document.getElementById("submit");
    this.elemements = requestFormNodes();
    this.showLoaders();
    this.handleTokenUpdate();
    this.fetchRequest();
    this.handleSubmit();
  }

  showLoaders() {
    setInterval(() => {
      if (this.state.isFetching) {
        this.submit.innerHTML = "Saving changes...";
        this.submit.setAttribute("disabled", "disabled");
      } else {
        this.submit.innerHTML = "Save changes";
        this.submit.removeAttribute("disabled");
      }
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

  fetchRequest() {
    back.addEventListener("click", () => redirect("back"));
    setTimeout(() => {
      this.setState({ isFetching: true });
      const el = this.elemements;
      api
        .get(`/users/request/${this.id}/`, this.state.token)
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
            const { request } = data;
            el.title.value = request.title;
            el.location.value = request.location;
            el.description.value = request.description;
            if (request.request_type == "repair") {
              el.request_type[1].setAttribute("checked", "checked");
            } else {
              el.request_type[0].setAttribute("checked", "checked");
            }
          } else {
            if (this.state.status === 404) {
              content.innerHTML = `<h1>Request not found :(</h1>`;
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
        })
        .catch(err => console.log(err));
    }, 0);
  }

  handleChange() {
    const elems = Object.values(this.elemements).filter(el => el.name);
    const { data } = { ...this.state };
    elems.map(el => {
      data[el.name] = el.value;
    });
    if (this.elemements.request_type[0].checked) {
      data["request_type"] = "maintenance";
    } else {
      data["request_type"] = "repair";
    }
    this.setState({ data });
  }

  handleSubmit(e) {
    setTimeout(() => {
      const errors = { ...this.state.errors };
      if (this.state.isAuthenticated) {
        this.submit.addEventListener("click", e => {
          this.handleChange();
          e.preventDefault();
          this.setState({ isFetching: true });
          api
            .update(
              `/users/request/${this.id}/`,
              this.state.token,
              this.state.data
            )
            .then(res => {
              this.setState({ success: res.ok });
              return res.json();
            })
            .then(data => {
              this.setState({ isFetching: false });
              if (this.state.success) {
                sessionStorage.setItem("success", data.message);
                redirect(`/requests/view/?${this.id}`);
              } else {
                Object.values(data).map(value => {
                  Object.entries(value).map(val => {
                    errors[val[0]] = val[1];
                    this.setState({ errors });
                  });
                });
              }
            })
            .catch(err => {
              this.setState({ isFetching: false });
              console.log(err.message);
            });
        });
      } else {
        redirect("/auth/signin/");
      }
    }, 0);
  }
}

new Edit();
