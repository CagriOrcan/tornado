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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setSession } = useAuthStore();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Login Error', error.message);
    } else if (data.session) {
      setSession(data.session);
    }
  };

  const navigateToSignUp = () => {
    router.push('/(auth)/signup');
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

            {/* Login Form */}
            <Card variant="elevated" padding="lg" style={{ marginBottom: 24 }}>
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: TornadoColors.gray[900],
                textAlign: 'center',
                marginBottom: 8,
                fontFamily: 'Inter',
              }}>
                Welcome Back
              </Text>
              <Text style={{
                fontSize: 16,
                color: TornadoColors.gray[600],
                textAlign: 'center',
                marginBottom: 32,
                fontFamily: 'Inter',
              }}>
                Sign in to continue your Tornado journey
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
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ marginBottom: 32 }}
              />

              <Button
                title="Sign In"
                onPress={handleLogin}
                loading={loading}
                gradient
                size="lg"
                style={{ marginBottom: 16 }}
              />

              <TouchableOpacity
                onPress={() => Alert.alert('Forgot Password', 'Feature coming soon!')}
                style={{ alignItems: 'center' }}
              >
                <Text style={{
                  color: TornadoColors.primary,
                  fontSize: 14,
                  fontFamily: 'Inter',
                }}>
                  Forgot your password?
                </Text>
              </TouchableOpacity>
            </Card>

            {/* Sign Up Link */}
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
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity onPress={navigateToSignUp}>
                <Text style={{
                  color: TornadoColors.white,
                  fontSize: 16,
                  fontWeight: 'bold',
                  fontFamily: 'Inter',
                }}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
