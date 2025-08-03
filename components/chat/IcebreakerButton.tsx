import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { TornadoColors } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';
import {
  ICEBREAKER_QUESTIONS,
  CATEGORY_INFO,
  getRandomQuestion,
  getQuestionsByCategory,
  type IcebreakerCategory,
} from '@/data/icebreakerQuestions';

interface IcebreakerButtonProps {
  onSelectQuestion: (question: string) => void;
  disabled?: boolean;
}

const { height: screenHeight } = Dimensions.get('window');

export function IcebreakerButton({ onSelectQuestion, disabled = false }: IcebreakerButtonProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<IcebreakerCategory | null>(null);
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);
  
  const buttonScale = useSharedValue(1);
  const modalScale = useSharedValue(0);

  const handlePress = () => {
    if (disabled) return;
    buttonScale.value = withSpring(0.95, { damping: 15 }, () => {
      buttonScale.value = withSpring(1, { damping: 15 });
    });
    setIsModalVisible(true);
    modalScale.value = withSpring(1, { damping: 15 });
  };

  const handleCloseModal = () => {
    modalScale.value = withTiming(0, { duration: 200 }, () => {
      setIsModalVisible(false);
      setSelectedCategory(null);
    });
  };

  const handleQuestionSelect = (question: string, questionId: string) => {
    setUsedQuestionIds(prev => [...prev, questionId]);
    onSelectQuestion(question);
    handleCloseModal();
  };

  const handleRandomQuestion = () => {
    const randomQuestion = getRandomQuestion(usedQuestionIds);
    handleQuestionSelect(randomQuestion.question, randomQuestion.id);
  };

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: modalScale.value }],
    opacity: modalScale.value,
  }));

  const renderCategoryView = () => {
    if (!selectedCategory) return null;
    
    const questions = getQuestionsByCategory(selectedCategory);
    const availableQuestions = questions.filter(q => !usedQuestionIds.includes(q.id));
    const categoryData = CATEGORY_INFO[selectedCategory];

    return (
      <View style={{ flex: 1 }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: TornadoColors.gray[200],
        }}>
          <TouchableOpacity
            onPress={() => setSelectedCategory(null)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: TornadoColors.gray[100],
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <Text style={{ fontSize: 16, color: TornadoColors.gray[700] }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: TornadoColors.gray[900] }}>
            {categoryData.emoji} {categoryData.name}
          </Text>
        </View>

        <ScrollView style={{ flex: 1, marginTop: 16 }} showsVerticalScrollIndicator={false}>
          {availableQuestions.map((question) => (
            <TouchableOpacity
              key={question.id}
              onPress={() => handleQuestionSelect(question.question, question.id)}
              style={{
                backgroundColor: TornadoColors.white,
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: TornadoColors.gray[200],
                shadowColor: TornadoColors.black,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
              activeOpacity={0.7}
            >
              <Text style={{
                fontSize: 16,
                color: TornadoColors.gray[900],
                lineHeight: 22,
                fontFamily: 'System',
              }}>
                {question.question}
              </Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 8,
              }}>
                <View style={{
                  backgroundColor: TornadoColors.secondary,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                }}>
                  <Text style={{
                    fontSize: 12,
                    color: TornadoColors.primary,
                    fontWeight: '500',
                    fontFamily: 'System',
                  }}>
                    {question.tone}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          
          {availableQuestions.length === 0 && (
            <View style={{
              alignItems: 'center',
              paddingVertical: 32,
            }}>
              <Text style={{ fontSize: 48, marginBottom: 16 }}>🎯</Text>
              <Text style={{
                fontSize: 16,
                color: TornadoColors.gray[600],
                textAlign: 'center',
                fontFamily: 'System',
              }}>
                You've used all questions in this category!
              </Text>
              <Text style={{
                fontSize: 14,
                color: TornadoColors.gray[500],
                textAlign: 'center',
                marginTop: 8,
                fontFamily: 'System',
              }}>
                Try another category or get a random question.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  const renderMainView = () => (
    <View style={{ flex: 1 }}>
      <View style={{
        alignItems: 'center',
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: TornadoColors.gray[200],
      }}>
        <Text style={{ fontSize: 32, marginBottom: 12 }}>💭</Text>
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: TornadoColors.gray[900],
          textAlign: 'center',
          marginBottom: 8,
          fontFamily: 'System',
        }}>
          Icebreaker Questions
        </Text>
        <Text style={{
          fontSize: 14,
          color: TornadoColors.gray[600],
          textAlign: 'center',
          fontFamily: 'System',
        }}>
          Break the ice with interesting conversation starters
        </Text>
      </View>

      <View style={{ flex: 1, paddingTop: 24 }}>
        <TouchableOpacity
          onPress={handleRandomQuestion}
          style={{ marginBottom: 24 }}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[TornadoColors.gradientStart, TornadoColors.gradientEnd]}
            style={{
              padding: 16,
              borderRadius: 16,
              alignItems: 'center',
              shadowColor: TornadoColors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Text style={{ fontSize: 24, marginBottom: 8 }}>🎲</Text>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: TornadoColors.white,
              textAlign: 'center',
              fontFamily: 'System',
            }}>
              Random Question
            </Text>
            <Text style={{
              fontSize: 14,
              color: TornadoColors.white,
              opacity: 0.9,
              textAlign: 'center',
              marginTop: 4,
              fontFamily: 'System',
            }}>
              Get a surprise question from any category
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={{
          fontSize: 16,
          fontWeight: '600',
          color: TornadoColors.gray[700],
          marginBottom: 16,
          fontFamily: 'System',
        }}>
          Or choose by category:
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {Object.entries(CATEGORY_INFO).map(([key, category]) => (
            <TouchableOpacity
              key={key}
              onPress={() => setSelectedCategory(key as IcebreakerCategory)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: TornadoColors.white,
                borderRadius: 12,
                padding: 16,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: TornadoColors.gray[200],
                shadowColor: TornadoColors.black,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 24, marginRight: 12 }}>{category.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: TornadoColors.gray[900],
                  fontFamily: 'System',
                }}>
                  {category.name}
                </Text>
                <Text style={{
                  fontSize: 13,
                  color: TornadoColors.gray[600],
                  marginTop: 2,
                  fontFamily: 'System',
                }}>
                  {category.description}
                </Text>
              </View>
              <Text style={{ fontSize: 16, color: TornadoColors.gray[400] }}>→</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  return (
    <>
      <Animated.View style={animatedButtonStyle}>
        <TouchableOpacity
          onPress={handlePress}
          disabled={disabled}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: TornadoColors.secondary,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 8,
            opacity: disabled ? 0.5 : 1,
          }}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 18 }}>💭</Text>
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="none"
        onRequestClose={handleCloseModal}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end',
        }}>
          <Animated.View style={[
            animatedModalStyle,
            {
              backgroundColor: TornadoColors.white,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              maxHeight: screenHeight * 0.8,
              paddingTop: 8,
            }
          ]}>
            <View style={{
              width: 40,
              height: 4,
              backgroundColor: TornadoColors.gray[300],
              borderRadius: 2,
              alignSelf: 'center',
              marginBottom: 16,
            }} />
            
            <View style={{ flex: 1, paddingHorizontal: 20, paddingBottom: 20 }}>
              {selectedCategory ? renderCategoryView() : renderMainView()}
            </View>

            <View style={{
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 20,
              borderTopWidth: 1,
              borderTopColor: TornadoColors.gray[200],
            }}>
              <Button
                title="Close"
                onPress={handleCloseModal}
                variant="outline"
                size="lg"
              />
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}