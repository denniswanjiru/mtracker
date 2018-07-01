import { Component } from "../utils/App";
import api from "../utils/api";
import { redirect } from "../utils/routes";
import { requestFormNodes } from "../utils/nodes";

class NewRequest extends Component {
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
    this.handleSubmit();
  }

  showLoaders() {
    setInterval(() => {
      if (this.state.isFetching) {
        this.submit.innerHTML = "Making request...";
        this.submit.setAttribute("disabled", "disabled");
      } else {
        this.submit.innerHTML = "Make Request";
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
          console.log(this.state);
          api
            .post(`/users/requests/`, this.state.data, this.state.token)
            .then(res => {
              this.setState({ success: res.ok });
              return res.json();
            })
            .then(data => {
              this.setState({ isFetching: false });
              if (this.state.success) {
                sessionStorage.setItem("success", data.message);
                redirect(`/requests/`);
              } else {
                const errors = { ...this.state.errors };
                Object.entries(data).map(value => {
                  errors[value[0]] = value[1];
                  this.setState({ errors });
                });
                console.log(this.state.errors);
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

new NewRequest();
