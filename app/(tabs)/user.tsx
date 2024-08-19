import { StyleSheet, TouchableOpacity } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { Link, useRouter } from 'expo-router';

export default function TabTwoScreen() {
  const router = useRouter();
  
  const handleEdit = () => {
    router.push('/edit');
  };


  return (
    <View style={styles.container}>
      <View style={styles.userWrapper}>
        <View style={styles.userInfo}>
          <View>
            <Text style={styles.name}>Kayky</Text>
            <Text style={styles.username}>@dev.kayky</Text>
          </View>
          <View style={styles.followInfo}>
            <Text>Seguindo: 10</Text>
            <Text>Seguidores: 100</Text>
          </View>
        </View>
        <View style={styles.picture}>
          
        </View>
      </View>
      <View>
        <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
          <Text>Editar Perfil</Text>
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
  userWrapper: {
    flexDirection: 'row',
    gap: 16,
  },
  picture: {
    width: 75,
    height: 75,
    borderRadius: 50,
    backgroundColor: 'gray',
    marginLeft: 'auto'
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
