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

export const apiUrl = `${window.location.protocol}//${
  window.location.hostname
}${window.location.hostname === "localhost" ? ":" + ports.serverPort : ""}`;

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

export const rolesMapping = { "Super Admin": 0, Admin: 1, User: 2 };

export const rolesArray = ["Super Admin", "Admin", "User"];
