import { createContext, useContext } from "react";

import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";

const UserContext = createContext();

const poolData = {
  UserPoolId: process.env.REACT_APP_USERPOOLID, // User pool id
  ClientId: process.env.REACT_APP_CLIENTID, // Client id
};

const userPool = new CognitoUserPool(poolData);

export const AuthContextProvider = ({ children }) => {
  // Sign-up new user
  const createUser = (username, email, password) => {
    var attributeList = [];
    const emailAttribute = {
      Name: "email",
      Value: email,
    };
    attributeList.push(new CognitoUserAttribute(emailAttribute));

    return new Promise((resolve, reject) => {
      userPool.signUp(
        username,
        password,
        attributeList,
        null,
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        }
      );
    });
  };

  // Confirm email verfication code
  const confirmUser = (username, confirmationCode) => {
    const userData = {
      Username: username,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(
        confirmationCode,
        true, // Force Alias Creation
        function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  };

  // Sign-in existing user
  const loginUser = (username, password) => {
    var authData = {
      Username: username,
      Password: password,
    };

    var authDetails = new AuthenticationDetails(authData);

    const userData = {
      Username: username,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  };

  // Retrieve the current user from local storage
  const getAuthenticatedUser = () => {
    return userPool.getCurrentUser();
  };

  // Sign-out user (invalidates all issued tokens)
  const logoutUser = () => {
    return getAuthenticatedUser().signOut();
  };

  // Check if a user is authenticated in Cognito and refresh tokens
  const isAuthenticated = () => {
    return new Promise((success, reject) => {
      const cognitoUser = getAuthenticatedUser();

      if (!cognitoUser) {
        reject("Could not retrieve current user");
        return;
      }

      cognitoUser.getSession((err, session) => {
        if (err) {
          reject("Error retrieving user session: ", err);
          return;
        }

        if (session.isValid()) {
          success("Session is valid, user is authenticated");
        } else {
          reject("Session is not valid");
        }
      });
    });
  };

  return (
    <UserContext.Provider
      value={{
        createUser,
        confirmUser,
        loginUser,
        logoutUser,
        getAuthenticatedUser,
        isAuthenticated,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};
