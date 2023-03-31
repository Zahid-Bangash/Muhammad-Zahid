import React, { useContext } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { TeamsContext } from './TeamsContext';

const SelectTeamModal = ({ visible, onClose, onSelectTeam }) => {
  const { teams } = useContext(TeamsContext);

  const handleSelectTeam = (team) => {
    onSelectTeam(team);
    onClose();
  };

  return (
    <Modal visible={visible} animationType='slide'>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, marginBottom: 20 }}>Select a Team</Text>
        {teams.map((team) => (
          <TouchableOpacity key={team.id} onPress={() => handleSelectTeam(team)}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>{team.name}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={onClose}>
          <Text style={{ fontSize: 18, color: 'blue' }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default SelectTeamModal;