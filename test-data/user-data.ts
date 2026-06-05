interface UserSignUpData {
  email: string;
  firstName: string;
  lastName: string;
}

export const userSignUpData = {
  validSignUp: {
    email: `signup.cataw+${Date.now()}@gmail.com`,
    // password loaded from env at runtime
    firstName: "Jane",
    lastName: "Doe",
  } satisfies UserSignUpData,
};

interface ExistingUserData {
  email: string;
}

export const ExistingUserData = {
  validSignIn: {
    email: "signup.cataw+2123@gmail.com",
    // password loaded from env at runtime
  } satisfies ExistingUserData,
};
