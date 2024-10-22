import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Pressable, View } from 'react-native';
import { Text } from '@/components/Themed';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface Post {
  id: string;
  user_login: string;
  message: string;
}

const PostItem: React.FC<{ item: Post }> = ({ item }) => {
  const router = useRouter();

  return (
    <View style={styles.post}>
      <Link href={`/user/${item.user_login}`} style={styles.picture}>
        <Pressable>
          <View />
        </Pressable>
      </Link>
      <View style={styles.content}>
        <View style={styles.name}>
          <Text>@{item.user_login}</Text>
        </View>
        <View style={styles.text}>
          <Text>{item.message}</Text>
        </View>
        <Pressable onPress={() => router.push(`/post/${item.id}/replies`)} style={styles.replyButton}>
          <Text>
            Comentários
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const TabOneScreen: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  console.log(posts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');

        if (!userData) {
          console.error('Token not found');
          return;
        }

        const response = await fetch('https://api.papacapim.just.pro.br/posts', {
          method: 'GET',
          headers: {
            'x-session-token': JSON.parse(userData).token,
          },
        });

        if (response.ok) {
          const data = await response.json();

          setPosts(data);
        } else {
          console.error('Failed to fetch posts');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item }) => <PostItem item={item} />}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
      <Link href="/new-post" style={styles.floatingButton}>
        <Text style={styles.floatingButtonText}>+</Text>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    width: '100%',
  },
  picture: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: 'gray',
  },
  post: {
    padding: 16,
    flexDirection: 'row',
    gap: 16,
  },
  content: {
    gap: 8,
    alignItems: 'center',
    width: '100%',
    flexShrink: 1,
  },
  name: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    width: '100%',
  },
  container: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#555',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 16,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007bff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    textAlign: 'center',
  },
  floatingButtonText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    lineHeight: 60,
  },
  replyButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 6,
    marginTop: 16,
  },
});

export default TabOneScreen;
