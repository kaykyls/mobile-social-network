import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Pressable, View, RefreshControl } from 'react-native';
import { Text } from '@/components/Themed';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface Like {
  id: number;
  user_login: string;
  post_id: number;
}

interface Post {
  id: string;
  user_login: string;
  message: string;
  liked: boolean;
  likeId?: number;
  likesCount: number;
}

const PostItem: React.FC<{ item: Post; onLikeToggle: (id: string, liked: boolean, likeId?: number) => void }> = ({ item, onLikeToggle }) => {
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
        <Text style={styles.likesCount}>{item.likesCount} {item.likesCount > 1 ? 'curtidas' : 'curtida'}</Text>
        <Pressable onPress={() => router.push(`/post/${item.id}/replies`)} style={styles.replyButton}>
          <Text>Comentários</Text>
        </Pressable>
        <Pressable onPress={() => onLikeToggle(item.id, item.liked, item.likeId)} style={styles.likeButton}>
          <Text>{item.liked ? 'Descurtir' : 'Curtir'}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const TabOneScreen: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);  // Estado para controlar o pull-to-refresh
  const [userLogin, setUserLogin] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUserLogin(JSON.parse(userData).user_login);
      }
    };

    fetchUserData();
  }, []);

  const fetchPosts = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');

      if (!userData) {
        console.error('Token not found');
        return;
      }

      const token = JSON.parse(userData).token;

      const response = await fetch('https://api.papacapim.just.pro.br/posts', {
        method: 'GET',
        headers: {
          'x-session-token': token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const postsWithLikes = await Promise.all(data.map(async (post: Post) => {
          const likesResponse = await fetch(`https://api.papacapim.just.pro.br/posts/${post.id}/likes`, {
            method: 'GET',
            headers: {
              'x-session-token': token,
            },
          });

          const likesData: Like[] = await likesResponse.json();

          const userLike = likesData.find(like => like.user_login === userLogin);
          const liked = Boolean(userLike);

          return {
            ...post,
            liked,
            likeId: userLike?.id,
            likesCount: likesData.length,
          };
        }));

        setPosts(postsWithLikes);
      } else {
        console.error('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);  // Para parar o pull-to-refresh
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [userLogin]);

  const handleLikeToggle = async (postId: string, currentlyLiked: boolean, likeId?: number) => {
    const userData = await AsyncStorage.getItem('user');
    if (!userData) {
      console.error('Token not found');
      return;
    }

    const token = JSON.parse(userData).token;

    try {
      if (currentlyLiked && likeId) {
        const url = `https://api.papacapim.just.pro.br/posts/${postId}/likes/${likeId}`;
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            'x-session-token': token,
          },
        });

        if (response.ok) {
          setPosts(prevPosts =>
            prevPosts.map(post => {
              if (post.id === postId) {
                return {
                  ...post,
                  liked: false,
                  likesCount: post.likesCount - 1,
                };
              }
              return post;
            })
          );
        } else {
          console.error('Failed to remove like');
        }
      } else {
        const url = `https://api.papacapim.just.pro.br/posts/${postId}/likes`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'x-session-token': token,
          },
        });

        if (response.ok) {
          setPosts(prevPosts =>
            prevPosts.map(post => {
              if (post.id === postId) {
                return {
                  ...post,
                  liked: true,
                  likesCount: post.likesCount + 1,
                };
              }
              return post;
            })
          );
        } else {
          console.error('Failed to add like');
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <PostItem item={item} onLikeToggle={handleLikeToggle} />
          )}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
    alignItems: 'flex-start',
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
  likeButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 6,
    marginTop: 8,
  },
  likesCount: {
    marginVertical: 8,
    fontWeight: 'bold',
  },
});

export default TabOneScreen;
