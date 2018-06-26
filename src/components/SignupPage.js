import { signupElems } from "../nodes";
import api from "./api";

class SignupPage {
  constructor() {
    this.state = {
      data: {},
      errors: {},
      success: null
    };
    this.elements = signupElems();
    this.submit = document.forms.signup.elements.submit;
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
      api
        .post("/users/auth/signup/", this.state.data)
        .then(res => {
          Object.assign(this.state, { success: res.ok });
          return res.json();
        })
        .then(data => {
          if (this.state.success) {
            localStorage.setItem("success", data.message);
            window.location.replace("http://127.0.0.1:8080/auth/signin.html");
          } else {
            Object.values(data).map(value => {
              Object.entries(value).map(val => {
                errors[val[0]] = val[1];
                Object.assign(this.state, { errors });
              });
            });
          }
        })
        .catch(err => console.log(err.message));
    });
  }
}

const signup = new SignupPage();
signup.handleChange();
signup.handleSubmit();
