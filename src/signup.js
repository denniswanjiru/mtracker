import { signupElems } from "./nodes";
import { post } from "./api";

const state = {
  data: {},
  errors: {},
  success: null
};

const elements = signupElems();
const submitSignup = document.forms.signup.elements.submit;

Object.values(elements).map(el => {
  el.addEventListener("change", e => {
    state.data[e.target.name] = e.target.value;
    console.log(state.data);
  });
});

submitSignup.addEventListener("click", e => {
  e.preventDefault();
  console.log(state.data);
  post("/users/auth/signup/", state.data)
    .then(res => {
      state.success = res.ok;
      return res.json();
    })
    .then(data => {
      if (state.success) {
        localStorage.setItem("success", data.message);
        window.location.replace("http://127.0.0.1:8080/auth/signin.html");
      } else {
        Object.values(data).map(value => {
          Object.entries(value).map(val => {
            state.errors[val[0]] = val[1];
          });
        });
      }
      console.log(state.errors);
    })
    .catch(err => console.log(err.message));
});
