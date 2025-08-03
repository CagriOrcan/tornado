import { View, Text, Button, TextInput, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/auth';

export default function ProfileScreen() {
  const { user, profile, setProfile, setSession } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setBirthDate(profile.birth_date || '');
      setCity(profile.city || '');
      setBio(profile.bio || '');
      setInterests((profile.interests || []).join(', '));
    }
  }, [profile]);

  const handleUpdateProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        birth_date: birthDate,
        city,
        bio,
        interests: interests.split(',').map((item) => item.trim()),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setProfile(data);
      Alert.alert('Success', 'Profile updated successfully');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput placeholder="Full Name" value={fullName} onChangeText={setFullName} />
      <TextInput placeholder="Birth Date (YYYY-MM-DD)" value={birthDate} onChangeText={setBirthDate} />
      <TextInput placeholder="City" value={city} onChangeText={setCity} />
      <TextInput placeholder="Bio" value={bio} onChangeText={setBio} />
      <TextInput placeholder="Interests (comma separated)" value={interests} onChangeText={setInterests} />
      <Button title="Update Profile" onPress={handleUpdateProfile} />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
