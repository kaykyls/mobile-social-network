import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Alert, FlatList, View as RNView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import Icon from 'react-native-vector-icons/Ionicons';

interface UserData {
  name: string;
  login: string;
}

interface Post {
  id: number;
  message: string;
}

export default function TabTwoScreen() {
  const [userData, setUserData] = useState<UserData>({ name: '', login: '' });
  const [posts, setPosts] = useState<Post[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null);
  const colorScheme = useColorScheme();
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        const response = await fetch(`https://api.papacapim.just.pro.br/users/${user.user_login}`, {
          headers: {
            'x-session-token': user.token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData({
            name: data.name,
            login: data.login,
          });
        } else {
          Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
        }

        // Fetch posts for the user
        fetchUserPosts(user.user_login, user.token);
      } else {
        Alert.alert('Erro', 'ID do usuário não encontrado.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao tentar buscar os dados do usuário.');
    }
  };

  const fetchUserPosts = async (login: string, token: string) => {
    try {
      const response = await fetch(`https://api.papacapim.just.pro.br/users/${login}/posts`, {
        headers: {
          'x-session-token': token,
        },
      });

      if (response.ok) {
        const data: Post[] = await response.json();
        setPosts(data);
      } else {
        Alert.alert('Erro', 'Não foi possível carregar as postagens do usuário.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao tentar buscar as postagens do usuário.');
    }
  };

  const handleEdit = () => {
    router.push('/edit');
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    router.push('/login');
  };

  const handleDeletePost = async (postId: number) => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (!userData) {
        throw new Error('User data is null');
      }

      const user = JSON.parse(userData);

      const response = await fetch(`https://api.papacapim.just.pro.br/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'x-session-token': user.token,
        },
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Postagem excluída com sucesso.');
        // Refresh posts after deletion
        fetchUserPosts(user.user_login, user.token);
      } else {
        Alert.alert('Erro', 'Não foi possível excluir a postagem.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao tentar excluir a postagem.');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const renderPostItem = ({ item }: { item: Post }) => (
    <View style={styles.postItem}>
      <Text style={styles.postMessage}>{item.message}</Text>
      <TouchableOpacity
        style={styles.dropdownIcon}
        onPress={() => setDropdownVisible(dropdownVisible === item.id ? null : item.id)}
      >
        <Icon name="ellipsis-horizontal" size={24} color="#000" />
      </TouchableOpacity>
      {dropdownVisible === item.id && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity onPress={() => handleDeletePost(item.id)} style={styles.dropdownItem}>
            <Text style={styles.dropdownItemText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.userWrapper}>
        <View style={styles.userInfo}>
          <View>
            <Text style={styles.name}>{userData.name}</Text>
            <Text style={styles.username}>@{userData.login}</Text>
          </View>
          <View style={styles.followInfo}>
            <Text>Seguindo: 10</Text>
            <Text>Seguidores: 100</Text>
          </View>
        </View>
        <View style={styles.picture}></View>
      </View>
      <View>
        <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
          <Text style={styles.editBtnText}>Editar Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={{ color: Colors[colorScheme ?? 'light'].text }}>Sair</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.postList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  editBtn: {
    backgroundColor: '#007BFF',
    padding: 10,
    alignItems: 'center',
    borderRadius: 6,
    marginTop: 32,
  },
  logoutBtn: {
    borderWidth: 1,
    borderColor: '#555',
    padding: 10,
    alignItems: 'center',
    borderRadius: 6,
    marginTop: 16,
  },
  editBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  userWrapper: {
    flexDirection: 'row',
    gap: 16,
  },
  picture: {
    width: 75,
    height: 75,
    borderRadius: 50,
    backgroundColor: 'gray',
    marginLeft: 'auto',
  },
  followInfo: {
    flexDirection: 'row',
    gap: 8,
  },
  userInfo: {
    gap: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  username: {
    color: 'gray',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  postList: {
    marginTop: 16,
  },
  postItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    position: 'relative',
    height: 80
    // Certifique-se de que o dropdown esteja em relação a este componente
  },
  postMessage: {
    fontSize: 16,
  },
  dropdownIcon: {
    position: 'absolute',
    right: 10,
    top: 12,
  },
  dropdownMenu: {
    position: 'absolute',
    right: 10,
    top: 40,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    elevation: 2,
    zIndex: 10, // Aumente o zIndex se necessário
    overflow: 'visible', // Garanta que o conteúdo seja visível
  },
  dropdownItem: {
    padding: 8,
    alignItems: 'center',
  },
  dropdownItemText: {
    color: 'red',
    fontWeight: 'bold',
  },
});
