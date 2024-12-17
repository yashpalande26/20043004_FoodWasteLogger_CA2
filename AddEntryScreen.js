import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddEntryScreen({ onEntryAdded }) {
    const [foodName, setFoodName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [reason, setReason] = useState('');

    const handleSubmit = async () => {
        if (!foodName || !quantity || !reason) {
            Alert.alert('Error', 'Please fill out all fields!');
        } else {
            const newEntry = {
                id: new Date().toString(), 
                foodName,
                quantity,
                reason,
            };

            try {
                // Get current entries from AsyncStorage
                const storedEntries = await AsyncStorage.getItem('entries');
                const entries = storedEntries ? JSON.parse(storedEntries) : [];

                
                entries.push(newEntry);

                // Save updated entries back to AsyncStorage
                await AsyncStorage.setItem('entries', JSON.stringify(entries));

                Alert.alert('Success', `Logged: ${foodName}, ${quantity}, ${reason}`);

                // Reset the form after submission
                setFoodName('');
                setQuantity('');
                setReason('');

                
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
            <Button title="Log Entry" onPress={handleSubmit} />
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
});