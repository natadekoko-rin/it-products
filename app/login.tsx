import MText from "@/components/common/text";
import { useState } from "react";
import { KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity, useColorScheme, StyleSheet, Platform } from "react-native";
import { login } from "./store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { useRouter } from "expo-router";
import { LoadingIndicator } from "@/components/common/loading-indicator";
import MCard from "@/components/common/card";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleLogin = async () => {
    setValidationError(null);

    // Simple validation
    if (!username.trim() || !password.trim()) {
      setValidationError('Username and Password cannot be empty.');
      return;
    }

    if (username.trim().length < 3) {
      setValidationError('Username must be at least 3 characters.');
      return;
    }

    const resultAction = await dispatch(login({ username: username.trim(), password }));
    if (login.fulfilled.match(resultAction)) {
      router.replace('/(tabs)');
    }
  };

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeContainer = isDark ? styles.darkContainer : styles.lightContainer;
  const themeText = isDark ? '#FFFFFF' : '#000000';
  const themeInput = isDark ? styles.darkInput : styles.lightInput;
  const themeCard = isDark ? styles.darkCard : styles.lightCard;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, themeContainer]}
    >
      <ScrollView contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
      }}>
        <MCard style={{ justifyContent: "center", alignItems: "center", padding: 16 }}>
          <MText text="username : emilys" color="white"></MText>
          <MText text="password : emilyspass" color="white"></MText>
        </MCard>
        <MCard style={themeCard}>
          <MCard style={styles.inputGroup}>
            <MText text="Username" size={14} weight="600" color={themeText} style={styles.label} />
            <TextInput
              style={[styles.input, themeInput]}
              placeholder="e.g. emilys"
              placeholderTextColor={isDark ? '#FFFFFF' : '#000000'}
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />
          </MCard>

          <MCard style={styles.inputGroup}>
            <MText text="Password" size={14} weight="600" color={themeText} style={styles.label} />
            <MCard style={
              [
                styles.passwordContainer,

              ]
            }>
              <TextInput
                style={[styles.input, themeInput, styles.passwordInput]}
                placeholder={showPassword ? "password" : "******"}
                placeholderTextColor={isDark ? '#FFFFFF' : '#000000'}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <MaterialIcons
                  name={showPassword ? 'visibility' : 'visibility-off'}
                  size={22}
                  color={themeText}
                />
              </TouchableOpacity>
            </MCard>
          </MCard>

          <TouchableOpacity
            style={[
              styles.button,
              isDark ? styles.darkButton : styles.lightButton,
              isLoading && styles.buttonDisabled
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingIndicator size="small" fullscreen={false} color={isDark ? '#000000' : '#FFFFFF'} style={{ padding: 0 }} />
            ) : (
              <MText text="Sign In" size={16} weight="700" color={isDark ? '#000000' : '#FFFFFF'} style={styles.buttonText} />
            )}
          </TouchableOpacity>

          <MCard style={{ justifyContent: "center", alignItems: "center", padding: 16 }}>
            {error && <MText text={error} size={14} weight="500" color="#EF4444" />}
            {validationError && <MText text={validationError} size={14} weight="500" color="#EF4444" />}
          </MCard>
        </MCard>
      </ScrollView>
    </KeyboardAvoidingView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightContainer: {
    backgroundColor: '#FFFFFF',
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  lightCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 8,
  },
  darkCard: {
    backgroundColor: '#000000',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 8,
  },
  inputGroup: {
    marginBottom: 16,
    padding: 0,
    borderRadius: 0,
  },
  label: {
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  lightInput: {
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    color: '#000000',
  },
  darkInput: {
    borderColor: '#FFFFFF',
    backgroundColor: '#000000',
    color: '#FFFFFF',
  },
  passwordContainer: {
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
    padding: 0, borderRadius: 0,
  },
  passwordInput: {
    flex: 1,
    paddingRight: 44,
  },
  eyeIcon: {
    position: 'absolute',
    right: 14,
    height: '100%',
    justifyContent: 'center',
  },
  button: {
    height: 48,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  lightButton: {
    backgroundColor: '#000000',
  },
  darkButton: {
    backgroundColor: '#FFFFFF',
  },
  buttonDisabled: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  buttonText: {
    letterSpacing: 0.5,
  },
  errorText: {
    padding: 10,
    borderRadius: 6,
    marginBottom: 14,
    textAlign: 'center',
    borderWidth: 1,
  },
  lightErrorText: {
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
  },
  darkErrorText: {
    borderColor: '#FFFFFF',
    backgroundColor: '#000000',
  },
});
