import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BackButton from '../../components/BackButton';
import colors from './styles/colors';

export default function AgendamentoScreen() {
  const [selectedDate, setSelectedDate] = useState('');

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Agendar Serviço</Text>
      
      {/* Calendário temporário - você precisará instalar react-native-calendars */}
      <View style={styles.calendarPlaceholder}>
        <Text style={styles.calendarText}>Calendário aqui</Text>
        <Text style={styles.calendarText}>Data selecionada: {selectedDate || 'Nenhuma'}</Text>
      </View>

      <View style={styles.timeSlots}>
        {['09:00', '11:00', '14:00', '16:00'].map(time => (
          <TouchableOpacity key={time} style={styles.timeSlot}>
            <Text style={styles.timeText}>{time}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.confirmButton}>
        <MaterialIcons name="schedule" size={20} color="white" />
        <Text style={styles.buttonText}>Confirmar Agendamento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.primary,
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
  calendarText: {
    fontSize: 16,
    color: colors.gray,
    marginBottom: 10
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