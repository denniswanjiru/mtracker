import { signinNodes } from "./nodes";
import { redirect } from "./routes";
import { Component } from "./App";
import api from "./api";

class Signin extends Component {
  constructor() {
    super();
    this.state = {
      data: {},
      errors: {},
      success: null
    };
    this.elements = signinNodes();
    this.submit = document.forms.signin.elements.submit;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showLoaders();
  }

  showLoaders() {
    setInterval(() => {
      if (this.state.isFetching) {
        this.submit.innerHTML = "Signing in...";
        this.submit.setAttribute("disabled", "disabled");
      } else {
        this.submit.innerHTML = "Sign in";
        this.submit.removeAttribute("disabled");
      }
    }, 0);
  }

  handleChange() {
    const data = { ...this.state.data };
    Object.values(this.elements).map(el => {
      el.addEventListener("change", e => {
        data[e.target.name] = e.target.value;
        this.setState({ data });
        console.log(this.state.data);
      });
    });
  }

  handleSubmit(e) {
    const errors = { ...this.state.errors };
    this.submit.addEventListener("click", e => {
      e.preventDefault();
      this.setState({ isFetching: true });
      console.log(this.state.data);
      api
        .post("/users/auth/signin/", this.state.data)
        .then(res => {
          this.setState({ success: res.ok });
          return res.json();
        })
        .then(data => {
          this.setState({ isFetching: false });
          if (this.state.success) {
            localStorage.setItem("token", data.access_token);
            redirect("/requests/");
          } else {
            Object.entries(data).map(val => {
              errors[val[0]] = val[1];
              this.setState({ errors });
            });
            console.log(this.state.errors);
          }
        })
        .catch(err => {
          this.setState({ isFetching: true });
          console.log(err.message);
        });
    });
  }
}

const signin = new Signin();
signin.handleChange();
signin.handleSubmit();
