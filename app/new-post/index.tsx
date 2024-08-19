import React, { useState } from 'react';
import { StyleSheet, TextInput, Pressable, View } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter } from 'expo-router';

const NewPost: React.FC = () => {
  const [content, setContent] = useState('');
  const router = useRouter();

  const handlePost = () => {
    console.log('Post content:', content);
    router.push('/');
  };

  return (
    <View style={styles.container}>
        <Text style={styles.title}>O que está acontecendo?</Text>
        <TextInput
            placeholderTextColor={'#555'}
            style={styles.textInput}
            multiline
            numberOfLines={10}
            placeholder="Escreva o seu post aqui..."
            value={content}
            onChangeText={setContent}
        />
        <Pressable style={styles.button} onPress={handlePost}>
            <Text style={styles.buttonText}>Postar</Text>
        </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        marginBottom: 16,
        borderBottomWidth: 1,
        borderColor: '#555',
        paddingBottom: 16
    },
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'space-between',
    },
    textInput: {
        flex: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        textAlignVertical: 'top',
        fontSize: 16,
        marginBottom: 16
    },
    button: {
        backgroundColor: '#007bff',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default NewPost;
