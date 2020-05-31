import { AsyncStorage } from 'react-native';

// export const SIGNUP = 'SIGNUP';
// export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

export const authenticate = (userId, token) => {
  return { type: AUTHENTICATE, userId: userId, token: token };
};

export const signup = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDiTwN6cRcM4IVLKzw0NNfnR7JGpbcUVIY',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      },
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      const errorId = errorResponse.error.message;

      let message = 'Something went wrong!';
      if (errorId === 'EMAIL_EXISTS') {
        message = 'This email has already been used';
      }
      throw new Error(message);
    }

    const resData = await response.json();

    dispatch(authenticate(resData.localId, resData.idToken));
    // dispatch({ type: LOGIN, token: resData.idToken, userId: resData.localId });

    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000,
    );
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

export const login = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDiTwN6cRcM4IVLKzw0NNfnR7JGpbcUVIY',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      },
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      const errorId = errorResponse.error.message;

      let message = 'Something went wrong!';
      if (errorId === 'EMAIL_NOT_FOUND') {
        message = 'This email could not be found';
      } else if (errorId === 'INVALID_PASSWORD') {
        message = 'This password is not valid';
      }
      throw new Error(message);
    }

    const resData = await response.json();

    dispatch(authenticate(resData.localId, resData.idToken));

    // expiresIn is a string which we need to confirm into a number.
    // x 1000 to convert into milliseconds since getTime() returns ms
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000,
    );
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

export const logout = () => {
  return { type: LOGOUT };
};

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString(),
    }),
  );
};
