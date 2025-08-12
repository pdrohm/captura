import { BottomSheetComponent } from '@/src/components/BottomSheetComponent';
import { Territory } from '@/src/types/domain';
import React from 'react';
import { Alert } from 'react-native';
import { TerritoryDetails } from './TerritoryDetails';

interface TerritoryModalScreenProps {
  visible: boolean;
  territory: Territory | null;
  onClose: () => void;
  onEdit?: () => void;
}

export const TerritoryModalScreen: React.FC<TerritoryModalScreenProps> = ({
  visible,
  territory,
  onClose,
  onEdit,
}) => {
  const handleEditTerritory = () => {
    if (onEdit) {
      onEdit();
    } else {
      Alert.alert(
        'Edit Territory',
        'Territory editing feature coming soon!',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  if (!territory) {
    return null;
  }

  return (
    <BottomSheetComponent
      visible={visible}
      onClose={onClose}
      height="60%"
    >
      <TerritoryDetails
        territory={territory}
        onClose={onClose}
        onEdit={handleEditTerritory}
      />
    </BottomSheetComponent>
  );
};
