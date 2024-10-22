import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interfaces para definir a estrutura dos dados
interface User {
    // id: number;
    name: string;
    user_login: string;
}

interface Post {
    // id: number;  // id do post
    user_login: string;  // login do usuário que postou
    message: string;  // conteúdo do post
}

// Tipo que abrange os resultados
type Result = User | Post;

const SearchScreen = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Result[]>([]);
    const [searchType, setSearchType] = useState<'users' | 'posts'>('users');

    const handleSearchType = (type: 'users' | 'posts') => {
        setResults([]);

        setSearchType(type);
    }

    useEffect(() => {
        const fetchResults = async () => {
            const userData = await AsyncStorage.getItem('user');

            if (!userData) {
                console.error('Token not found');
                return;
            }

            try {
                const endpoint = searchType === 'users' 
                    ? `https://api.papacapim.just.pro.br/users?search=${query}`
                    : `https://api.papacapim.just.pro.br/posts?search=${query}`;

                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: {
                        'x-session-token': JSON.parse(userData).token,
                    },
                });
                const data: Result[] = await response.json(); // Especifica o tipo de dados esperado
                setResults(data);

        console.log(data);

            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        };

        if (query.length > 0) {
            fetchResults();
        } else {
            setResults([]);
        }
    }, [query, searchType]);

    return (
        <View style={styles.container}>
            
            <TextInput
                style={styles.input}
                value={query}
                onChangeText={setQuery}
                placeholder="Buscar"
            />
            <View style={styles.tabContainer}>
                <TouchableOpacity 
                    style={[styles.tab, searchType === 'users' && styles.activeTab]} 
                    onPress={() => handleSearchType('users')}
                >
                    <Text style={styles.tabText}>Usuários</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tab, searchType === 'posts' && styles.activeTab]} 
                    onPress={() => handleSearchType('posts')}
                >
                    <Text style={styles.tabText}>Posts</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={results}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.resultItem}>
                        {searchType === 'users' ? (
                            <>
                                <View style={styles.profilePicture} />
                                <View>
                                    <Text style={styles.name}>{(item as User).name}</Text>
                                    <Text style={styles.login}>{(item as User).user_login}</Text>
                                </View>
                            </>
                        ) : (
                            <>
                                <View style={styles.profilePicture} />
                                <View>
                                    <Text style={styles.name}>{(item as Post).message}</Text>
                                    <Text style={styles.login}>Por: {(item as Post).user_login}</Text>
                                </View>
                            </>
                        )}
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    tab: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'gray',
    },
    activeTab: {
        backgroundColor: '#ddd',
    },
    tabText: {
        fontWeight: 'bold',
        color: "#fff"
    },
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
