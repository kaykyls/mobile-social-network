import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Reply {
    id: number;
    user_login: string;
    message: string;
    created_at: string;
}

const ItemSeparator = () => {
    return <View style={styles.separator} />;
};

const RepliesScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  console.log(id);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');

        if (!userData) {
            console.error('Token not found');
            return;
        }

        const response = await fetch(`https://api.papacapim.just.pro.br/posts/${id}/replies`, {
          headers: {
            'x-session-token': JSON.parse(userData).token,
          },
        });
        const data = await response.json();
        setReplies(data);
      } catch (error) {
        console.error('Error fetching replies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReplies();
  }, [id]);

  const handleSendComment = async () => {
    if (newComment.trim() === '') {
      Alert.alert('Erro', 'O comentário não pode estar vazio');
      return;
    }

    try {
      setIsSubmitting(true);
      const userData = await AsyncStorage.getItem('user');

      if (!userData) {
          console.error('Token not found');
          return;
      }

      const response = await fetch(`https://api.papacapim.just.pro.br/posts/${id}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-token': JSON.parse(userData).token,
        },
        body: JSON.stringify({
          message: newComment,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar comentário');
      }

      const newReply: Reply = await response.json();
      setReplies([newReply, ...replies]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
      Alert.alert('Erro', 'Não foi possível enviar o comentário');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Respostas' }} />
      <View style={styles.container}>
        <FlatList
          data={replies}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={ItemSeparator}
          renderItem={({ item }) => (
            <View style={styles.replyContainer}>
              <Text style={styles.text}>@{item.user_login}</Text>
              <Text style={styles.text}>{item.message}</Text>
              <Text style={styles.text}>{new Date(item.created_at).toLocaleString()}</Text>
            </View>
          )}
        />
        <View style={styles.commentContainer}>
          <TextInput
            style={styles.input}
            placeholder="Escreva seu comentário..."
            placeholderTextColor="#999"
            value={newComment}
            onChangeText={setNewComment}
            editable={!isSubmitting}
          />
          <Button
            title={isSubmitting ? 'Enviando...' : 'Enviar'}
            onPress={handleSendComment}
            disabled={isSubmitting}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  replyContainer: {
    marginBottom: 16,
    borderRadius: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
  commentContainer: {
    marginTop: 16,
    padding: 10,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 10,
    borderRadius: 4,
  },
  text: {
    marginBottom: 4,
  },
});

export default RepliesScreen;
