import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import colors from './styles/colors';

export default function AgendamentoScreen() {
  const { isDarkMode, primaryColor } = useTheme();
  const [selectedDate, setSelectedDate] = useState('');

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={[styles.header, isDarkMode && styles.headerDark]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={primaryColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: primaryColor}]}>Agendar Serviço</Text>
        <TouchableOpacity style={styles.addButton}>
          <MaterialIcons name="add" size={24} color={primaryColor} />
        </TouchableOpacity>
      </View>
      
      {/* Calendário temporário - você precisará instalar react-native-calendars */}
      <View style={[styles.calendarPlaceholder, isDarkMode && styles.calendarPlaceholderDark]}>
        <Text style={[styles.calendarText, isDarkMode && styles.textDark]}>Calendário aqui</Text>
        <Text style={[styles.calendarText, isDarkMode && styles.textDark]}>Data selecionada: {selectedDate || 'Nenhuma'}</Text>
      </View>

      <View style={styles.timeSlots}>
        {['09:00', '11:00', '14:00', '16:00'].map(time => (
          <TouchableOpacity key={time} style={[styles.timeSlot, isDarkMode && styles.timeSlotDark]}>
            <Text style={[styles.timeText, {color: primaryColor}]}>{time}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={[styles.confirmButton, {backgroundColor: primaryColor}]}>
        <MaterialIcons name="schedule" size={20} color="white" />
        <Text style={styles.buttonText}>Confirmar Agendamento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  containerDark: {
    backgroundColor: '#121212'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerDark: {
    backgroundColor: '#1E1E1E',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  addButton: {
    padding: 8,
  },
  calendarPlaceholder: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  calendarPlaceholderDark: {
    backgroundColor: '#1E1E1E',
    shadowColor: '#000',
  },
  calendarText: {
    fontSize: 16,
    color: colors.gray,
    marginBottom: 10
  },
  textDark: {
    color: '#E0E0E0',
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  timeSlot: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  timeSlotDark: {
    backgroundColor: '#1E1E1E',
    shadowColor: '#000',
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary
  },
  confirmButton: {
    height: 50,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10
  }
});