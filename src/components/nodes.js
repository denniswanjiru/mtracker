export const signupNodes = () => {
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

export const signinNodes = () => {
  const signin = document.forms.signin;
  const { username, password } = signin.elements;

  return {
    username,
    password
  };
};
