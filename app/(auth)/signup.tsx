import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/auth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { TornadoColors } from '../../constants/Colors';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setSession } = useAuthStore();
  const router = useRouter();

  const validateInputs = () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Sign Up Error', error.message);
    } else if (data.session) {
      setSession(data.session);
      router.replace('/(auth)/profile-setup');
    } else {
      Alert.alert(
        'Check Your Email', 
        'Please check your email for a confirmation link to complete your registration.'
      );
    }
  };

  const navigateToLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <LinearGradient 
      colors={[TornadoColors.gradientStart, TornadoColors.gradientEnd]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            contentContainerStyle={{ 
              flexGrow: 1, 
              justifyContent: 'center',
              padding: 24,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* App Logo/Title Section */}
            <View style={{ alignItems: 'center', marginBottom: 48 }}>
              <Text style={{
                fontSize: 48,
                fontWeight: 'bold',
                color: TornadoColors.white,
                fontFamily: 'Inter',
                marginBottom: 8,
              }}>
                🌪️
              </Text>
              <Text style={{
                fontSize: 32,
                fontWeight: 'bold',
                color: TornadoColors.white,
                fontFamily: 'Inter',
                marginBottom: 8,
              }}>
                Tornado
              </Text>
              <Text style={{
                fontSize: 16,
                color: TornadoColors.white,
                opacity: 0.9,
                textAlign: 'center',
                fontFamily: 'Inter',
              }}>
                Conversation first, profile second
              </Text>
            </View>

            {/* Sign Up Form */}
            <Card variant="elevated" padding="lg" style={{ marginBottom: 24 }}>
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: TornadoColors.gray[900],
                textAlign: 'center',
                marginBottom: 8,
                fontFamily: 'Inter',
              }}>
                Join Tornado
              </Text>
              <Text style={{
                fontSize: 16,
                color: TornadoColors.gray[600],
                textAlign: 'center',
                marginBottom: 32,
                fontFamily: 'Inter',
              }}>
                Create your account and start connecting
              </Text>

              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                style={{ marginBottom: 16 }}
              />

              <Input
                label="Password"
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ marginBottom: 16 }}
              />

              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={{ marginBottom: 32 }}
              />

              <Button
                title="Create Account"
                onPress={handleSignUp}
                loading={loading}
                gradient
                size="lg"
                style={{ marginBottom: 16 }}
              />

              <Text style={{
                fontSize: 12,
                color: TornadoColors.gray[500],
                textAlign: 'center',
                fontFamily: 'Inter',
                lineHeight: 16,
              }}>
                By signing up, you agree to our Terms of Service and Privacy Policy
              </Text>
            </Card>

            {/* Login Link */}
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text style={{
                color: TornadoColors.white,
                fontSize: 16,
                fontFamily: 'Inter',
              }}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={navigateToLogin}>
                <Text style={{
                  color: TornadoColors.white,
                  fontSize: 16,
                  fontWeight: 'bold',
                  fontFamily: 'Inter',
                }}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
