import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/auth';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setSession } = useAuthStore();
  const router = useRouter();

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setSession(data.session);
      router.replace('/(auth)/profile-setup');
    }
  };

  return (
    <LinearGradient colors={['#FF8C42', '#E85D04']} style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Text>Sign Up</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ backgroundColor: 'white', padding: 10, borderRadius: 5, marginBottom: 10 }} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ backgroundColor: 'white', padding: 10, borderRadius: 5, marginBottom: 10 }} />
      <Button title="Sign Up" onPress={handleSignUp} />
    </LinearGradient>
  );
}
