import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';

export default function UserProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.userWrapper}>
        <View style={styles.userInfo}>
          <View>
            <Text style={styles.name}>User Name</Text>
            <Text style={styles.username}>@user.username</Text>
          </View>
          <View style={styles.followInfo}>
            <Text>Following: 50</Text>
            <Text>Followers: 200</Text>
          </View>
        </View>
        <View style={styles.picture}>
          
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});