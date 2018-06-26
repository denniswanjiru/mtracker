const baseRoute = "http://127.0.0.1:8080";

export const redirect = path => window.location.replace(`${baseRoute}${path}`);
