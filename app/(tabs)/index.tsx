import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, FlatList, Pressable, View, RefreshControl } from 'react-native';
import { Text } from '@/components/Themed';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';

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
        <View style={styles.likesCount}>
          <Text>{item.likesCount} {item.likesCount > 1 ? 'curtidas' : 'curtida'}</Text>
        </View>
        <View style={styles.actions}>
          <Pressable onPress={() => router.push(`/post/${item.id}/replies`)} style={styles.actionButton}>
            <Icon name="chatbubble-outline" size={24} color="#007bff" />
          </Pressable>
          <Pressable onPress={() => onLikeToggle(item.id, item.liked, item.likeId)} style={styles.actionButton}>
            <Icon name={item.liked ? "heart" : "heart-outline"} size={24} color={item.liked ? "red" : "#007bff"} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const TabOneScreen: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userLogin, setUserLogin] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUserLogin(JSON.parse(userData).user_login);
      }
    };

    fetchUserData();
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const userData = await AsyncStorage.getItem('user');
      if (!userData) throw new Error('User data not found');

      const token = JSON.parse(userData).token;
      const response = await fetch('https://api.papacapim.just.pro.br/posts', {
        method: 'GET',
        headers: { 'x-session-token': token },
      });

      if (!response.ok) throw new Error('Failed to fetch posts');

      const data: Post[] = await response.json();
      const likesData: Like[] = await fetchAllLikes(data.map(post => post.id), token);

      const postsWithLikes = data.map((post) => {
        const postIdAsNumber = Number(post.id);
        const userLike = likesData.find(like => like.post_id === postIdAsNumber && like.user_login === userLogin);
        return {
          ...post,
          liked: Boolean(userLike),
          likeId: userLike?.id,
          likesCount: likesData.filter(like => like.post_id === postIdAsNumber).length,
        };
      });
      

      setPosts(postsWithLikes);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userLogin]);

  const fetchAllLikes = async (postIds: string[], token: string): Promise<Like[]> => {
    const likesPromises = postIds.map(postId =>
      fetch(`https://api.papacapim.just.pro.br/posts/${postId}/likes`, {
        method: 'GET',
        headers: { 'x-session-token': token },
      })
      .then(res => res.ok ? res.json() : [])
      .catch(() => [])
    );

    const likesResults = await Promise.all(likesPromises);
    return likesResults.flat();
  };

  useEffect(() => {
    if (userLogin) fetchPosts();
  }, [userLogin, fetchPosts]);

  const handleLikeToggle = async (postId: string, currentlyLiked: boolean, likeId?: number) => {
    const userData = await AsyncStorage.getItem('user');
    if (!userData) {
      console.error('User data not found');
      return;
    }

    const token = JSON.parse(userData).token;
    try {
      const url = currentlyLiked && likeId 
        ? `https://api.papacapim.just.pro.br/posts/${postId}/likes/${likeId}`
        : `https://api.papacapim.just.pro.br/posts/${postId}/likes`;

      const method = currentlyLiked && likeId ? 'DELETE' : 'POST';
      const response = await fetch(url, { method, headers: { 'x-session-token': token } });

      if (!response.ok) throw new Error(currentlyLiked ? 'Failed to remove like' : 'Failed to add like');

      const responseData = currentlyLiked ? undefined : await response.json();

      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              liked: !currentlyLiked,
              likesCount: currentlyLiked ? post.likesCount - 1 : post.likesCount + 1,
              likeId: currentlyLiked ? undefined : (responseData?.id || post.likeId),
            };
          }
          return post;
        })
      );
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  likesCount: {
    marginVertical: 8,
    fontWeight: 'bold',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
});

export default TabOneScreen;
