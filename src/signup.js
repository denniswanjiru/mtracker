import { signupElems } from "./nodes";
import { post } from "./api";

const elements = signupElems();
let data = {};
const submitSignup = document.forms.signup.elements.submit;

Object.entries(elements).map(val => {
  const el = val[1];
  el.addEventListener("change", e => {
    data[e.target.name] = e.target.value;
    console.log(data);
  });
});

submitSignup.addEventListener("click", e => {
  e.preventDefault();
  post("/users/auth/signup/", data)
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
});
