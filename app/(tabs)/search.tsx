import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';

interface User {
    name: string;
    login: string;
}

interface Post {
    id: string;
    user_login: string;
    message: string;
}

type Result = User | Post;

const SearchScreen = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Result[]>([]);
    const [searchType, setSearchType] = useState<'users' | 'posts'>('users');

    const handleSearchType = (type: 'users' | 'posts') => {
        setResults([]);
        setSearchType(type);
    };

    const fetchLikes = useCallback(async (posts: Post[], token: string) => {
        const likesPromises = posts.map(post =>
            fetch(`https://api.papacapim.just.pro.br/posts/${post.user_login}/likes`, {
                method: 'GET',
                headers: { 'x-session-token': token },
            })
            .then(res => res.ok ? res.json() : [])
            .catch(() => [])
        );

        const likesResults = await Promise.all(likesPromises);
        return likesResults.flat();
    }, []);

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
                const data: Result[] = await response.json();

                if (searchType === 'posts') {
                    const token = JSON.parse(userData).token;
                    const postsWithLikes = await Promise.all(
                        (data as Post[]).map(async post => {
                            const likes = await fetchLikes([post], token);
                            return {
                                ...post,
                                liked: Boolean(likes.find(like => like.user_login === post.user_login)),
                                likeId: likes.find(like => like.user_login === post.user_login)?.id,
                                likesCount: likes.length,
                            };
                        })
                    );
                    setResults(postsWithLikes);
                } else {
                    setResults(data);
                }

            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        };

        if (query.length > 0) {
            fetchResults();
        } else {
            setResults([]);
        }
    }, [query, searchType, fetchLikes]);

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
                renderItem={({ item }) => {
                    return (
                        <>
                            {searchType === 'users' ? (
                                <Link
                                    href={`/user/${(item as User).login}`}
                                    style={{ borderBottomColor: '#ddd', borderBottomWidth: 1 }}
                                >
                                    <View style={styles.resultItem}>
                                        <View style={styles.profilePicture} />
                                        <View>
                                            <Text style={styles.name}>{(item as User).name}</Text>
                                            <Text style={styles.login}>@{(item as User).login}</Text>
                                        </View>
                                    </View>
                                </Link>
                            ) : (
                                <View style={styles.postsResultItem}>
                                    <View>
                                        <Text style={styles.name}>{(item as Post).message}</Text>
                                        <Text style={styles.login}>@{(item as Post).user_login}</Text>
                                    </View>
                                </View>
                            )}
                        </>
                    );
                }}
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
    },
    activeTab: {
        borderBottomWidth: 1,
        borderBottomColor: 'blue',
    },
    tabText: {
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    resultItem: {
        flex: 1,
        flexDirection: 'row',
        paddingBottom: 10,
        paddingTop: 10,
    },
    postsResultItem: {
        flex: 1,
        flexDirection: 'row',
        paddingBottom: 10,
        paddingTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
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
