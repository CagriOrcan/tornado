import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { TornadoColors } from '@/constants/Colors';

interface PhotoUploadProps {
  label: string;
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
  error?: string;
}

export function PhotoUpload({
  label,
  photos,
  onPhotosChange,
  maxPhotos = 6,
  error,
}: PhotoUploadProps) {
  const [loading, setLoading] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant access to your photo library to upload photos.'
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    if (photos.length >= maxPhotos) {
      Alert.alert('Maximum Photos', `You can only upload up to ${maxPhotos} photos.`);
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setLoading(true);
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newPhotos = [...photos, result.assets[0].uri];
        onPhotosChange(newPhotos);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  const PhotoSlot = ({ index }: { index: number }) => {
    const hasPhoto = photos[index];
    
    return (
      <TouchableOpacity
        onPress={hasPhoto ? () => removePhoto(index) : pickImage}
        style={{
          width: 80,
          height: 80,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: hasPhoto ? TornadoColors.primary : TornadoColors.gray[300],
          borderStyle: hasPhoto ? 'solid' : 'dashed',
          backgroundColor: hasPhoto ? 'transparent' : TornadoColors.gray[50],
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
          marginBottom: 12,
          overflow: 'hidden',
        }}
      >
        {hasPhoto ? (
          <Image
            source={{ uri: hasPhoto }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        ) : (
          <View style={{ alignItems: 'center' }}>
            <Text style={{
              fontSize: 24,
              color: TornadoColors.gray[400],
              marginBottom: 4,
            }}>
              +
            </Text>
            <Text style={{
              fontSize: 10,
              color: TornadoColors.gray[500],
              textAlign: 'center',
              fontFamily: 'Inter',
            }}>
              Add{'\n'}Photo
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{
        fontSize: 14,
        fontWeight: '600',
        color: TornadoColors.gray[700],
        marginBottom: 8,
        fontFamily: 'Inter',
      }}>
        {label}
      </Text>
      
      <Text style={{
        fontSize: 12,
        color: TornadoColors.gray[500],
        marginBottom: 12,
        fontFamily: 'Inter',
      }}>
        Add up to {maxPhotos} photos ({photos.length}/{maxPhotos} added)
      </Text>

      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}>
        {Array.from({ length: maxPhotos }).map((_, index) => (
          <PhotoSlot key={index} index={index} />
        ))}
      </View>

      {error && (
        <Text style={{
          fontSize: 12,
          color: TornadoColors.error,
          marginTop: 4,
          fontFamily: 'Inter',
        }}>
          {error}
        </Text>
      )}
    </View>
  );
}