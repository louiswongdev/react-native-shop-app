import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';
import { useDispatch } from 'react-redux';
import * as authActions from '../store/actions/auth';

import Colors from '../constants/Colors';

const StartupScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        navigation.navigate('Auth');
        return;
      }

      const transformedData = JSON.parse(userData);
      const { token, userId, expiryDate } = transformedData;

      const expirationDate = new Date(expiryDate);

      // check if expirationDate is in the past (which means token has expired)
      if (expirationDate <= new Date() || !token || !userId) {
        navigation.navigate('Auth');
        return;
      }

      // what we should get back is a positive number, meaning it's in the future
      // i.e hasn't expired yet
      const expirationTime = expirationDate.getTime() - new Date().getTime();

      navigation.navigate('Shop');
      dispatch(authActions.authenticate(userId, token, expirationTime));
    };

    tryLogin();
  }, [dispatch]);

  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

export default StartupScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
