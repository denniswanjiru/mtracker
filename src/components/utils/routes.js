const baseRoute = "http://127.0.0.1:8080";

export const redirect = path => {
  if (path === "back") {
    return window.history.back();
  } else if (path === "forward") {
    return window.history.forward();
  } else {
    window.location.replace(`${baseRoute}${path}`);
  }
};
