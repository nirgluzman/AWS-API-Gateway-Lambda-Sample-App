import { createContext, useContext, useState, useEffect } from "react";

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
  const [user, setUser] = useState({});

  // Sign up new user
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
        true,
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

  // Sign in existing user
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
  //   // Sign out users
  //   const logoutUser = () => {
  //     return signOut(auth);
  //   };

  //   // Authentication state observer
  //   useEffect(() => {
  //     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  //       console.log("currentUser=", currentUser);
  //       setUser(currentUser);
  //     });
  //     return () => unsubscribe();
  //   }, []);

  return (
    <UserContext.Provider value={{ user, createUser, confirmUser, loginUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};
