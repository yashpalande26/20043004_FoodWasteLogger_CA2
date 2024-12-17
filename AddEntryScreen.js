import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

export default function AddEntryScreen({ onEntryAdded }) {
    const [foodName, setFoodName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [reason, setReason] = useState('');
    const [location, setLocation] = useState(null);
    const [hasLocationPermission, setHasLocationPermission] = useState(false);

    // Function to request permission and get location
    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need location permission to log food waste.');
            return;
        }
    
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location.coords); 
    };    

    const handleSubmit = async () => {
        if (!foodName || !quantity || !reason) {
            Alert.alert('Error', 'Please fill out all fields!');
        } else {
            if (!location) {
                Alert.alert('Error', 'Location not retrieved. Please try again.');
                return;
            }

            const newEntry = {
                id: new Date().toString(),
                foodName,
                quantity,
                reason,
                location, // Save location with entry
            };

            try {
                const storedEntries = await AsyncStorage.getItem('entries');
                const entries = storedEntries ? JSON.parse(storedEntries) : [];

                entries.push(newEntry);
                await AsyncStorage.setItem('entries', JSON.stringify(entries));

                Alert.alert('Success', `Logged: ${foodName}, ${quantity}, ${reason}`);

                setFoodName('');
                setQuantity('');
                setReason('');
                setLocation(null);

                if (onEntryAdded) {
                    onEntryAdded();
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to save the entry!');
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Add Food Waste Entry</Text>
            <TextInput
                style={styles.input}
                placeholder="Food Name"
                value={foodName}
                onChangeText={setFoodName}
            />
            <TextInput
                style={styles.input}
                placeholder="Quantity"
                value={quantity}
                keyboardType="numeric"
                onChangeText={setQuantity}
            />
            <TextInput
                style={styles.input}
                placeholder="Reason for Waste"
                value={reason}
                onChangeText={setReason}
            />
            <Button title="Get Location" onPress={getLocation} />
            <Button title="Log Entry" onPress={handleSubmit} />
            {location && (
                <Text style={styles.locationText}>
                    Location: Latitude {location.latitude}, Longitude {location.longitude}
                </Text>
            )}
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
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    locationText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
});