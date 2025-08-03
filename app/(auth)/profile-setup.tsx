import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/auth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { DatePicker } from '../../components/ui/DatePicker';
import { InterestPicker } from '../../components/ui/InterestPicker';
import { PhotoUpload } from '../../components/ui/PhotoUpload';
import { TornadoColors } from '../../constants/Colors';

type Step = 'basic' | 'details' | 'photos' | 'interests';

interface ProfileData {
  fullName: string;
  birthDate: Date | null;
  city: string;
  bio: string;
  photos: string[];
  interests: string[];
}

export default function ProfileSetupScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const [loading, setLoading] = useState(false);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: '',
    birthDate: null,
    city: '',
    bio: '',
    photos: [],
    interests: [],
  });

  const [errors, setErrors] = useState<Partial<ProfileData>>({});

  const steps: { key: Step; title: string; subtitle: string }[] = [
    { key: 'basic', title: 'Basic Info', subtitle: 'Tell us about yourself' },
    { key: 'details', title: 'More Details', subtitle: 'Share your story' },
    { key: 'photos', title: 'Add Photos', subtitle: 'Show your best self' },
    { key: 'interests', title: 'Your Interests', subtitle: 'What do you love?' },
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);

  const validateStep = (step: Step): boolean => {
    const newErrors: Partial<ProfileData> = {};

    switch (step) {
      case 'basic':
        if (!profileData.fullName.trim()) {
          newErrors.fullName = 'Full name is required';
        }
        if (!profileData.birthDate) {
          newErrors.birthDate = 'Birth date is required';
        } else {
          const age = new Date().getFullYear() - profileData.birthDate.getFullYear();
          if (age < 18) {
            newErrors.birthDate = 'You must be at least 18 years old';
          }
        }
        if (!profileData.city.trim()) {
          newErrors.city = 'City is required';
        }
        break;
      case 'details':
        if (!profileData.bio.trim()) {
          newErrors.bio = 'Bio is required';
        } else if (profileData.bio.length < 20) {
          newErrors.bio = 'Bio must be at least 20 characters';
        }
        break;
      case 'photos':
        if (profileData.photos.length === 0) {
          newErrors.photos = 'At least one photo is required';
        }
        break;
      case 'interests':
        if (profileData.interests.length < 3) {
          newErrors.interests = 'Please select at least 3 interests';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < steps.length) {
        setCurrentStep(steps[nextIndex].key);
      } else {
        handleSaveProfile();
      }
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].key);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setLoading(true);
    
    try {
      const { error } = await supabase.from('profiles').insert({
        id: user.id,
        full_name: profileData.fullName.trim(),
        birth_date: profileData.birthDate?.toISOString().split('T')[0],
        city: profileData.city.trim(),
        bio: profileData.bio.trim(),
        interests: profileData.interests,
        avatar_url: profileData.photos[0] || null,
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        router.replace('/(tabs)/');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateProfileData = (updates: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...updates }));
    setErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(updates).forEach(key => {
        delete newErrors[key as keyof ProfileData];
      });
      return newErrors;
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={profileData.fullName}
              onChangeText={(text) => updateProfileData({ fullName: text })}
              error={errors.fullName}
            />
            <DatePicker
              label="Birth Date"
              value={profileData.birthDate}
              onChange={(date) => updateProfileData({ birthDate: date })}
              error={errors.birthDate}
            />
            <Input
              label="City"
              placeholder="Enter your city"
              value={profileData.city}
              onChangeText={(text) => updateProfileData({ city: text })}
              error={errors.city}
            />
          </>
        );
      case 'details':
        return (
          <Input
            label="About You"
            placeholder="Tell people a bit about yourself..."
            value={profileData.bio}
            onChangeText={(text) => updateProfileData({ bio: text })}
            multiline
            numberOfLines={4}
            error={errors.bio}
          />
        );
      case 'photos':
        return (
          <PhotoUpload
            label="Your Photos"
            photos={profileData.photos}
            onPhotosChange={(photos) => updateProfileData({ photos })}
            error={errors.photos}
          />
        );
      case 'interests':
        return (
          <InterestPicker
            label="Your Interests"
            selectedInterests={profileData.interests}
            onInterestToggle={(interest) => {
              const newInterests = profileData.interests.includes(interest)
                ? profileData.interests.filter(i => i !== interest)
                : [...profileData.interests, interest];
              updateProfileData({ interests: newInterests });
            }}
            error={errors.interests}
          />
        );
    }
  };

  const currentStepData = steps[currentStepIndex];

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
          {/* Header */}
          <View style={{ padding: 24, paddingBottom: 0 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: TornadoColors.white,
                fontFamily: 'Inter',
              }}>
                Step {currentStepIndex + 1} of {steps.length}
              </Text>
              <Text style={{
                fontSize: 14,
                color: TornadoColors.white,
                opacity: 0.8,
                fontFamily: 'Inter',
              }}>
                🌪️ Profile Setup
              </Text>
            </View>

            {/* Progress Bar */}
            <View style={{
              height: 4,
              backgroundColor: TornadoColors.white,
              opacity: 0.3,
              borderRadius: 2,
              marginBottom: 8,
            }}>
              <View style={{
                height: '100%',
                backgroundColor: TornadoColors.white,
                borderRadius: 2,
                width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
              }} />
            </View>
          </View>

          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={{ 
              padding: 24,
              paddingTop: 8,
            }}
            showsVerticalScrollIndicator={false}
          >
            <Card variant="elevated" padding="lg">
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: TornadoColors.gray[900],
                marginBottom: 8,
                fontFamily: 'Inter',
              }}>
                {currentStepData.title}
              </Text>
              <Text style={{
                fontSize: 16,
                color: TornadoColors.gray[600],
                marginBottom: 32,
                fontFamily: 'Inter',
              }}>
                {currentStepData.subtitle}
              </Text>

              {renderStepContent()}
            </Card>
          </ScrollView>

          {/* Bottom Navigation */}
          <View style={{
            padding: 24,
            backgroundColor: 'transparent',
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {currentStepIndex > 0 ? (
                <Button
                  title="Back"
                  onPress={handleBack}
                  variant="ghost"
                  style={{ flex: 1, marginRight: 12 }}
                />
              ) : (
                <View style={{ flex: 1, marginRight: 12 }} />
              )}
              
              <Button
                title={currentStepIndex === steps.length - 1 ? 'Complete Profile' : 'Next'}
                onPress={handleNext}
                loading={loading}
                gradient
                style={{ flex: 2 }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
