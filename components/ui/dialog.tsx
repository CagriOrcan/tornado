import * as React from 'react';
import { View, Text, Modal, Pressable } from 'react-native';

const Dialog = ({ visible, onClose, children }) => (
  <Modal visible={visible} transparent onRequestClose={onClose}>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
        {children}
      </View>
    </View>
  </Modal>
);

const DialogTitle = ({ children }) => <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>{children}</Text>;

const DialogDescription = ({ children }) => <Text style={{ marginBottom: 20 }}>{children}</Text>;

const DialogFooter = ({ children }) => <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>{children}</View>;

export { Dialog, DialogTitle, DialogDescription, DialogFooter };
