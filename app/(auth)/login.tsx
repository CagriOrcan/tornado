import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/auth';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setSession } = useAuthStore();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error.message);
      Alert.alert('Login Error', error.message);
    } else if (data.session) {
      console.log('Login successful, session:', data.session);
      setSession(data.session);
    } else {
      console.log('Login completed, but no session returned.', data);
      Alert.alert('Login Status', 'Login completed, but no session was returned. Please check your credentials.');
    }
  };

  return (
    <LinearGradient colors={['#FF8C42', '#E85D04']} style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Text>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ backgroundColor: 'white', padding: 10, borderRadius: 5, marginBottom: 10 }} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ backgroundColor: 'white', padding: 10, borderRadius: 5, marginBottom: 10 }} />
      <Button title="Login" onPress={handleLogin} />
    </LinearGradient>
  );
}
