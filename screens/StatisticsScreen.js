import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StatisticsScreen() {
    const [stats, setStats] = useState({
        totalEntries: 0,
        totalQuantity: 0,
        mostCommonReason: '',
    });

    const calculateStats = async () => {
        try {
            const storedEntries = await AsyncStorage.getItem('entries');
            const entries = storedEntries ? JSON.parse(storedEntries) : [];

            const totalEntries = entries.length;
            const totalQuantity = entries.reduce((acc, entry) => acc + parseFloat(entry.quantity), 0);
            const reasonCounts = {};

            entries.forEach(entry => {
                reasonCounts[entry.reason] = (reasonCounts[entry.reason] || 0) + 1;
            });

            const mostCommonReason = Object.keys(reasonCounts).reduce((a, b) => 
                reasonCounts[a] > reasonCounts[b] ? a : b, '');

            setStats({
                totalEntries,
                totalQuantity,
                mostCommonReason,
            });
        } catch (error) {
            console.log('Failed to calculate stats:', error);
        }
    };

    useEffect(() => {
        calculateStats();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Food Waste Statistics</Text>
            <Text style={styles.statText}>Total Entries: {stats.totalEntries}</Text>
            <Text style={styles.statText}>Total Quantity Wasted: {stats.totalQuantity} items</Text>
            <Text style={styles.statText}>Most Common Reason: {stats.mostCommonReason || 'N/A'}</Text>
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
    statText: {
        fontSize: 16,
        marginBottom: 10,
    },
});
