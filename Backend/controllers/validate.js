import validator from "validator";

export const validateSignUpData = (req) => {
  const { firstname, lastname, username, email, password } = req.body;

  if (!firstname || !lastname) {
    throw new Error("Name is not valid!");
  } else if (!validator.isAlpha(firstname) || !validator.isAlpha(lastname)) {
    throw new Error("Name should contain only alphabets!");
  } else if (!validator.isLength(username, { min: 3, max: 15 })) {
    throw new Error("Username should be between 3 to 15 characters!");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not valid!");
  } else if (
    !validator.isStrongPassword(password, {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 0,
    })
  ) {
    throw new Error("Please enter a strong Password!");
  }
};
