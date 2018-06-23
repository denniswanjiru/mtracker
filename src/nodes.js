export const signupElems = () => {
  const signup = document.forms.signup;
  const { name, username, email, password, confirm_password } = signup.elements;

  return {
    name,
    username,
    email,
    password,
    confirmPassword: confirm_password
  };
};

export const signinElems = () => {
  const signin = document.forms.signin;
  const { username, password } = signin.elements;

  return {
    username,
    password
  };
};
