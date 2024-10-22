import React, { useState } from 'react';
import { StyleSheet, TextInput, Pressable, View, Alert } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NewPost: React.FC = () => {
  const [content, setContent] = useState('');
  const router = useRouter();

  const handlePost = async () => {
    const userData = await AsyncStorage.getItem('user');

    if (!userData) {
      console.error('Token not found');
      Alert.alert('Error', 'Token not found');
      return;
    }

    try {
      const response = await fetch('https://api.papacapim.just.pro.br/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-token': JSON.parse(userData).token,
        },
        body: JSON.stringify({
          post: {
            message: content,
          },
        }),
      });

      if (response.ok) {
        console.log('Post successful');
        router.push('/');
      } else {
        console.error('Failed to post');
        Alert.alert('Error', 'Failed to post');
      }
    } catch (error) {
      console.error('Error posting:', error);
      Alert.alert('Error', 'Error posting');
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Novo post' }} />
      <View style={styles.container}>
        <TextInput
          placeholderTextColor={'#555'}
          style={styles.textInput}
          multiline={true}
          placeholder="O que está acontecendo?"
          value={content}
          onChangeText={setContent}
        />
        <Pressable style={styles.button} onPress={handlePost}>
          <Text style={styles.buttonText}>Postar</Text>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  textInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default NewPost;