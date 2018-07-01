const select = selectors => {
  const nodes = {};
  selectors.map(selector => {
    nodes[selector] = document.getElementById(selector);
  });
  return nodes;
};

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

export const requestFormNodes = () => {
  const request = document.forms.request;
  const { title, location, request_type, description } = request.elements;

  return { title, location, request_type, description };
};

export const requestsNodes = () => {
  const { root, total, filterSection } = select([
    "root",
    "total",
    "filterSection"
  ]);

  return { root, total, filters: filterSection };
};

export const dashboardNodes = () => {
  return select([
    "content",
    "all",
    "pending",
    "approved",
    "resolved",
    "rejected"
  ]);
};

export const detailsNodes = () => {
  return select(["content", "actions"]);
};
