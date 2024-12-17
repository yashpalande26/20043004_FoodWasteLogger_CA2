import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ViewEntriesScreen() {
    const [entries, setEntries] = useState([]);

    // Load entries from AsyncStorage
    const loadEntries = async () => {
        try {
            const storedEntries = await AsyncStorage.getItem('entries');
            if (storedEntries) {
                setEntries(JSON.parse(storedEntries));
            }
        } catch (error) {
            console.log('Failed to load entries:', error);
        }
    };

    useEffect(() => {
        loadEntries();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Logged Food Waste Entries</Text>
            <FlatList
                data={entries}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.entryContainer}>
                        <Text style={styles.entryText}>Food: {item.foodName}</Text>
                        <Text style={styles.entryText}>Quantity: {item.quantity}</Text>
                        <Text style={styles.entryText}>Reason: {item.reason}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    entryContainer: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    entryText: {
        fontSize: 16,
        marginBottom: 5,
    },
});