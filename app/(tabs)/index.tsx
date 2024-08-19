import React from 'react';
import { StyleSheet, FlatList, Pressable, View } from 'react-native';
import { Text } from '@/components/Themed';
import { Link } from 'expo-router';

interface Post {
  id: string;
  name: string;
  username: string;
  content: string;
}

const posts: Post[] = Array.from({ length: 10 }, (_, index) => ({
  id: index.toString(),
  name: `User ${index + 1}`,
  username: `user${index + 1}`,
  content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium consectetur natus facere quasi temporibus, perspiciatis architecto ratione commodi accusamus laudantium sunt beatae rem ex optio, dolorum magni quas, ea doloremque? (Post ${index + 1})`,
}));

interface PostItemProps {
  item: Post;
}

const PostItem: React.FC<PostItemProps> = ({ item }) => (
  <View style={styles.post}>
    <Link href={`/user/${item.id}`} style={styles.picture}>
      <Pressable>
        <View />
      </Pressable>
    </Link>
    <View style={styles.content}>
      <View style={styles.name}>
        <Text>{item.name}</Text>
        <Text>@{item.username}</Text>
      </View>
      <View style={styles.text}>
        <Text>{item.content}</Text>
      </View>
    </View>
  </View>
);

const TabOneScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostItem item={item} />}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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
    textAlign: 'center'
  },
  floatingButtonText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    lineHeight: 60,
  },
});

export default TabOneScreen;