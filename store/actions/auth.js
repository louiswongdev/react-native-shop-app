export const SIGNUP = 'SIGNUP';

export const signup = (email, password) => {
  return async dispatch => {
    console.log('email:', email);
    console.log('password', password);
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
      throw new Error('Something went wrong');
    }

    const resData = await response.json();
    console.log(resData);

    dispatch({ type: SIGNUP });
  };
};
