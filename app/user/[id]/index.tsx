import { StyleSheet, Alert, Button, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Stack } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  user_login: string;
  token: string;
}

interface UserData {
  name: string;
  login: string;
}

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();

  const [userData, setUserData] = useState<UserData>({ name: '', login: '' });
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('user');

      if (userDataString) {
        const user = JSON.parse(userDataString);

        const response = await fetch(`https://api.papacapim.just.pro.br/users/${id}`, {
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

          checkIfFollowing(user, data.login);
        } else {
          Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
        }
      } else {
        Alert.alert('Erro', 'ID do usuário não encontrado.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao tentar buscar os dados do usuário.');
    }
  };

  const checkIfFollowing = async (user: User, profileLogin: string) => {
    try {
      const response = await fetch(`https://api.papacapim.just.pro.br/users/${profileLogin}/followers`, {
        headers: {
          'x-session-token': user.token,
        },
      });

      if (response.ok) {
        const followers: Array<{ follower_login: string }> = await response.json();

        const isFollowingUser = followers.some(follower => follower.follower_login === user.user_login);
        setIsFollowing(isFollowingUser);
      } else {
        Alert.alert('Erro', 'Não foi possível verificar o status de seguidor.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao verificar o status de seguidor.');
    }
  };

  const toggleFollow = async () => {
    setLoading(true);
    try {
      const userDataString = await AsyncStorage.getItem('user');
      if (userDataString) {
        const user: User = JSON.parse(userDataString);
        const method = isFollowing ? 'DELETE' : 'POST';

        const response = await fetch(`https://api.papacapim.just.pro.br/users/${userData.login}/followers${isFollowing ? "/1" : ""}`, {
          method: method,
          headers: {
            'x-session-token': user.token,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setIsFollowing(!isFollowing);
          Alert.alert(isFollowing ? 'Deixou de seguir' : 'Agora você está seguindo');
        } else {
          Alert.alert('Erro', 'Não foi possível realizar a ação.');
        }
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao tentar seguir/deixar de seguir.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Usuário Tal' }} />
      <View style={styles.container}>
        <View style={styles.userWrapper}>
          <View style={styles.userInfo}>
            <View>
              <Text style={styles.name}>{userData.name}</Text>
              <Text style={styles.username}>@{userData.login}</Text>
            </View>
            <View style={styles.followInfo}>
              <Text>Following: 50</Text>
              <Text>Followers: 200</Text>
            </View>
          </View>
          <View style={styles.picture}></View>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={toggleFollow}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{isFollowing ? 'Deixar de seguir' : 'Seguir'}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    padding: 10,
    textAlign: 'center',
    backgroundColor: '#007BFF',
    borderRadius: 6,
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
});