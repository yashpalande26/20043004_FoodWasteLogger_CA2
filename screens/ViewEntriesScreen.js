import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ViewLoggedEntriesScreen() {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        const loadEntries = async () => {
            const storedEntries = await AsyncStorage.getItem('entries');
            if (storedEntries) {
                const entries = JSON.parse(storedEntries);
                console.log('Entries loaded:', entries);  // Log entries to check for photo field
                setEntries(entries);
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
            {item.photo && (
                <Image source={{ uri: item.photo }} style={styles.imagePreview} />
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
    imagePreview: {
        marginTop: 10,
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
});