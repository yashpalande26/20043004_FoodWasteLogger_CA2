import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ViewLoggedEntriesScreen() {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        const loadEntries = async () => {
            const storedEntries = await AsyncStorage.getItem('entries');
            if (storedEntries) {
                setEntries(JSON.parse(storedEntries));
            }
        };

        loadEntries();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.entryContainer}>
            <Text style={styles.entryText}>
                <Text style={styles.boldText}>Food Name:</Text> {item.foodName}
            </Text>
            <Text style={styles.entryText}>
                <Text style={styles.boldText}>Quantity:</Text> {item.quantity}
            </Text>
            <Text style={styles.entryText}>
                <Text style={styles.boldText}>Reason:</Text> {item.reason}
            </Text>
            {item.location && (
                <Text style={styles.entryText}>
                    <Text style={styles.boldText}>Location:</Text> 
                    Latitude: {item.location.latitude}, Longitude: {item.location.longitude}
                </Text>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={entries}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
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
    entryContainer: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },
    entryText: {
        fontSize: 16,
        marginBottom: 5,
    },
    boldText: {
        fontWeight: 'bold',
    },
});