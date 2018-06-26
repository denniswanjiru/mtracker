import { signinNodes } from "../nodes";
import { post } from "../api";

class SigninPage {
  constructor() {
    this.state = {
      data: {},
      errors: {},
      success: null
    };
    this.elements = signinNodes();
    this.submit = document.forms.signin.elements.submit;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange() {
    const data = { ...this.state.data };
    Object.values(this.elements).map(el => {
      el.addEventListener("change", e => {
        data[e.target.name] = e.target.value;
        Object.assign(this.state, { data });
        console.log(this.state.data);
      });
    });
  }

  handleSubmit(e) {
    const errors = { ...this.state.errors };
    this.submit.addEventListener("click", e => {
      e.preventDefault();
      console.log(this.state.data);
      post("/users/auth/signin/", this.state.data)
        .then(res => {
          Object.assign(this.state, { success: res.ok });
          return res.json();
        })
        .then(data => {
          if (this.state.success) {
            localStorage.setItem("token", data.access_token);
            window.location.replace(
              "http://127.0.0.1:8080/pages/requests.html"
            );
          } else {
            Object.values(data).map(value => {
              Object.entries(value).map(val => {
                errors[val[0]] = val[1];
                Object.assign(this.state, { errors });
              });
            });
            console.log(this.state.errors);
          }
        })
        .catch(err => console.log(err.message));
    });
  }
}

const signin = new SigninPage();
signin.handleChange();
signin.handleSubmit();
