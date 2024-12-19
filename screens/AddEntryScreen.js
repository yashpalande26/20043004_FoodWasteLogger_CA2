import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

export default function AddEntryScreen({ onEntryAdded }) {
    const [foodName, setFoodName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [reason, setReason] = useState('');
    const [location, setLocation] = useState(null);
    const [hasLocationPermission, setHasLocationPermission] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(false); // Camera permission state

    useEffect(() => {
        const requestPermissions = async () => {
            try {
                // Request media library permission
                const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                console.log('Media Library Permission:', mediaLibraryStatus);
                setHasLocationPermission(mediaLibraryStatus === 'granted');

                // Request camera permission
                const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
                console.log('Camera Permission:', cameraStatus);
                setHasCameraPermission(cameraStatus === 'granted');
            } catch (error) {
                console.error('Error requesting permissions:', error);
            }
        };

        requestPermissions();
    }, []);

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

    // Function to pick an image from the camera
    const pickImage = async () => {
        if (!hasCameraPermission) {
            Alert.alert('Permission Error', 'Camera permission is required.');
            return;
        }

        console.log('Launching camera...');

        try {
            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const photoUri = result.assets[0].uri;
                console.log('Photo URI after capture:', photoUri);
                setPhoto(photoUri); // Save the photo URI to state
            } else {
                console.log('Error: No URI found in the result.');
                Alert.alert('Error', 'Failed to capture photo. Please try again.');
            }
        } catch (error) {
            console.error('Camera Error:', error);
            Alert.alert('Error', 'An error occurred while trying to open the camera.');
        }
    };

    const handleSubmit = async () => {
        if (!foodName || !quantity || !reason) {
            Alert.alert('Error', 'Please fill out all fields!');
            return;
        }

        if (!photo) {
            Alert.alert('Error', 'Please take a photo of the food waste.');
            return;
        }

        if (!location) {
            Alert.alert('Error', 'Location not retrieved. Please try again.');
            return;
        }

        const newEntry = {
            id: new Date().toString(),
            foodName,
            quantity,
            reason,
            location, 
            photo, 
        };

        try {
            const storedEntries = await AsyncStorage.getItem('entries');
            const entries = storedEntries ? JSON.parse(storedEntries) : [];

            entries.push(newEntry); 
            await AsyncStorage.setItem('entries', JSON.stringify(entries)); 

            
            console.log('Entries after save:', entries);

            Alert.alert('Success', `Logged: ${foodName}, ${quantity}, ${reason}`);

            
            setFoodName('');
            setQuantity('');
            setReason('');
            setLocation(null);
            setPhoto(null);

            if (onEntryAdded) {
                onEntryAdded();
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to save the entry!');
            console.error('Save Entry Error:', error);
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
            <Button title="Take Photo" onPress={pickImage} />
            
            {photo && <Image source={{ uri: photo }} style={styles.imagePreview} />}
            
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
    imagePreview: {
        marginTop: 10,
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
});
