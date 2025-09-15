import Icon from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BackButton() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Icon name="arrow-back" size={22} color="#3466F6" />
        <Text style={styles.text}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#3466F6',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 16,
  },
}); 