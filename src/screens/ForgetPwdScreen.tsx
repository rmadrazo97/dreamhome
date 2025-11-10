import React, { useState, useCallback } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Alert, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { getAppLangCode } from '../helpers/store';
import colors, { mediumFontFamily } from '../constants/Colors';

const ForgetPwdScreen = (props: { navigation: any }) => {
  const { navigation } = props;
  const [email, setEmail] = useState('');
  const [validating, setValidating] = useState(false);

  const handleNavigationBack = useCallback(() => {
      navigation.goBack();
  }, [navigation]);

  const validateEmail = useCallback((emailToValidate: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailToValidate);
  }, []);

  const resetPassword = useCallback(async () => {
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setValidating(true);

    try {
      const lang = await getAppLangCode();

      const response = await axios({
        method: 'POST',
        url: 'https://dreamhome.techlead.solutions/wp-json/cththemes/v1/listings/resetpwd',
        data: {
          user_login: trimmedEmail,
          cthlang: lang,
        },
      });
      console.log('response', response);
      const { success } = response.data;
      const responseTitle = response.data.title || 'Password Reset';
      const responseMessage = response.data.message || '';

      if (success) {
        Alert.alert(responseTitle, responseMessage, [
          { text: 'OK', onPress: handleNavigationBack }
        ]);
      } else {
        Alert.alert(responseTitle, responseMessage);
      }
    } catch (error) {
      console.error('Password reset error:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setValidating(false);
    }
  }, [email, validateEmail, handleNavigationBack]);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={handleNavigationBack} style={styles.closeButton}>
          <Text style={[styles.closeText, { color: colors.backBtn }]}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.loginInner}>
        <Text style={[styles.loginGreeting, { color: colors.hText }]}>
          Forgot Password
        </Text>
        <Text style={[styles.forgetDirection, { color: colors.pText }]}>
          Enter your email address and we'll send you a link to reset your password.
        </Text>

        <Text style={[styles.fieldLabel, { color: colors.fieldLbl }]}>
          Email Address
        </Text>
        <TextInput
          style={[
            styles.textInput,
            {
              borderColor: colors.separator,
              color: colors.regularText,
            },
          ]}
          onChangeText={setEmail}
          returnKeyType="done"
          autoCorrect={false}
          autoCapitalize="none"
          autoComplete="email"
          underlineColorAndroid="transparent"
          keyboardType="email-address"
          value={email}
          placeholder="Enter your email"
          placeholderTextColor={colors.fieldLbl}
          editable={!validating}
        />

        <View style={styles.spacer} />
        <TouchableOpacity
          onPress={resetPassword}
          disabled={validating}
          style={[
            styles.loginButton,
            {
              backgroundColor: colors.appColor,
            },
            validating && styles.disabledButton,
          ]}
        >
          <Text style={styles.loginButtonText}>
            {validating ? 'Sending...' : 'Send Reset Link'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 7,
  },
  closeButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginInner: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 30,
  },
  loginGreeting: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  forgetDirection: {
    marginTop: 30,
    fontSize: 17,
    lineHeight: 22,
  },
  fieldLabel: {
    fontSize: 17,
    marginTop: 40,
    fontWeight: '500',
  },
  textInput: {
    height: 50,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    fontSize: 17,
    fontFamily: mediumFontFamily,
    marginTop: 10,
  },
  spacer: {
    height: 60,
  },
  loginButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ForgetPwdScreen;