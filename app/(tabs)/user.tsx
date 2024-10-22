import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function TabTwoScreen() {
  const [userData, setUserData] = useState({ name: '', login: '' });
  const colorScheme = useColorScheme();
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');

      if (userData) {
        const user = JSON.parse(userData);

        console.log(user.user_login);

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
      } else {
        Alert.alert('Erro', 'ID do usuário não encontrado.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao tentar buscar os dados do usuário.');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleEdit = () => {
    router.push('/edit');
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    router.push('/login');
  };

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
  logoutBtnText: {
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
  },
});
