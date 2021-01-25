export const regularExpressions = {
  emailValidator: new RegExp(
    /[a-zA-Z0-9._-]{1,}@[a-zA-Z0-9._-]{1,}[.]{1}[a-zA-Z0-9._-]{1,}/
  ),
  passwordValidator: new RegExp(/^.{4,}$/),
};

export const ports = {
  serverPort: "3001",
  reactPort: "3000",
};

export const apiUrl = `http://${window.location.hostname}:${
  window.location.port === ports.reactPort
    ? ports.serverPort
    : window.location.port
}`;

export const feedbackStatusMapping = [
  "Unconfirmed",
  "Complaint",
  "Bounce:Permanent",
  "Bounce:Transient",
  "Bounce:Undertermined",
];

export const feedbackStatusColorMapping = [
  "default",
  "error",
  "warning",
  "processing",
  "success",
];

export const roles = [
  { label: "Super Admin", value: 0 },
  { label: "Admin", value: 1 },
  { label: "User", value: 2 },
];
