export default class Validate {
  constructor(parameters) {}

  static register = (must = true) => ({
    name: {
      presence: must,
      type: "string",
    },
    email: {
      presence: must,
      type: "string",
      email: true,
    },
    password: {
      presence: must,
      type: "string",
    },
  });

  static login = (must = true) => ({
    email: {
      presence: must,
      type: "string",
      email: true,
    },
    password: {
      presence: must,
      type: "string",
    },
  });
}
