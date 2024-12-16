import React from 'react';
import { SafeAreaView } from 'react-native';
import AddEntryScreen from './AddEntryScreen';
import { StyleSheet } from 'react-native';

export default function App() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <AddEntryScreen />
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

