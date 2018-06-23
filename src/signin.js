import { signinElems } from "./nodes";
import { post } from "./api";

if (localStorage.success) {
  console.log(localStorage.success);
}

setTimeout(() => {
  if (localStorage.success) {
    localStorage.removeItem("success");
  }
}, 3000);

const state = {
  data: {},
  errors: {},
  success: null
};

const elements = signinElems();
const submitSignin = document.forms.signin.elements.submit;

Object.values(elements).map(el => {
  el.addEventListener("change", e => {
    state.data[e.target.name] = e.target.value;
    console.log(state.data);
  });
});

submitSignin.addEventListener("click", e => {
  e.preventDefault();
  post("/users/auth/signin/", state.data)
    .then(res => {
      state.success = res.ok;
      return res.json();
    })
    .then(data => {
      console.log(state.success);
      if (state.success) {
        localStorage.setItem("token", data.access_token);
        console.log(data);
      } else {
        console.log("Error: ", data);
      }
      console.log(localStorage);
    });
});
