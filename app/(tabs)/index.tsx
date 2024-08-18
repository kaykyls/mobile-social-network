import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { Link } from 'expo-router';
import { Redirect } from 'expo-router';

export default function TabOneScreen() {
  const user = null;

  if (!user) {
    // return <Redirect href="/login" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.post}>
        <View style={styles.picture}>
          
        </View>
        <View style={styles.content}>
          <View style={styles.name}>
            <Text>name</Text>
            <Text>@username</Text>
          </View>
          <View style={styles.text}>
            <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium consectetur natus facere quasi temporibus, perspiciatis architecto ratione commodi accusamus laudantium sunt beatae rem ex optio, dolorum magni quas, ea doloremque?</Text>
          </View>
          
        </View>
      </View>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {/* <EditScreenInfo path="app/(tabs)/index.tsx" /> */}
    </View>
  );
}

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
  },
});
