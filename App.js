import React from 'react';
import { SafeAreaView,Button } from 'react-native';
import AddEntryScreen from '../screens/AddEntryScreen';
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import ViewEntriesScreen from '../screens/ViewEntriesScreen';
import StatisticsScreen from '../screens/StatisticsScreen';


export default function App() {
    const [screen, setScreen] = useState('add'); 
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Button
                title="Add New Entry"
                onPress={() => setScreen('add')}
            />
            <Button
                title="View Logged Entries"
                onPress={() => setScreen('view')}
            />
            <Button
                title="View Statistics"
                onPress={() => setScreen('stats')}
            />
            {screen === 'add' && <AddEntryScreen />}
            {screen === 'view' && <ViewEntriesScreen />}
            {screen === 'stats' && <StatisticsScreen />}
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

