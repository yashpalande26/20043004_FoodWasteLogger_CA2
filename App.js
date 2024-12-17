import React from 'react';
import { SafeAreaView,Button } from 'react-native';
import AddEntryScreen from './AddEntryScreen';
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import ViewEntriesScreen from './ViewEntriesScreen';

export default function App() {
  const [showEntries, setShowEntries] = useState(false);
  const [refreshEntries, setRefreshEntries] = useState(false);

  const handleEntryAdded = () => {
      setRefreshEntries(!refreshEntries); // Toggle refresh to reload entries
  };

  return (
      <SafeAreaView style={{ flex: 1 }}>
          <Button
              title={showEntries ? 'Add New Entry' : 'View Logged Entries'}
              onPress={() => setShowEntries(!showEntries)}
          />
          {showEntries ? (
              <ViewEntriesScreen key={refreshEntries} />
          ) : (
              <AddEntryScreen onEntryAdded={handleEntryAdded} />
          )}
      </SafeAreaView>
  );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
});

