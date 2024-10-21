import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchScreen = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ login: string, name: string, created_at: string, updated_at: string }[]>([]);

    useEffect(() => {
        const fetchResults = async () => {
            const userData = await AsyncStorage.getItem('user');

            if (!userData) {
                console.error('Token not found');
                return;
            }

            try {
                const response = await fetch(`https://api.papacapim.just.pro.br/users?search=${query}`, {
                    method: 'GET',
                    headers: {
                        'x-session-token': JSON.parse(userData).token,
                    },
                });
                const data = await response.json();
                setResults(data);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        };

        if (query.length > 0) {
            fetchResults();
        } else {
            setResults([]);
        }
    }, [query]);

    console.log(results);

    return (
        <View>
            <TextInput
                style={styles.input}
                value={query}
                onChangeText={setQuery}
                placeholder="Search"
            />
            <FlatList
                data={results}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.resultItem}>
                        <View style={styles.profilePicture} />
                        <View>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.login}>{item.login}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    profilePicture: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'gray',
        marginRight: 10,
    },
    name: {
        fontWeight: 'bold',
    },
    login: {
        color: 'gray',
    },
});

export default SearchScreen;