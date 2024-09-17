import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Stack, useRouter } from 'expo-router';

const EditProfileScreen = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userId, setUserId] = useState(null);
    const router = useRouter();
    const colorScheme = useColorScheme();

    const fetchUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                
                const user = JSON.parse(userData);
                setName(user.name);
                setUsername(user.login);
                setUserId(user.id);
            }
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleSaveNameAndUsername = async () => {
        if (!name || !username) {
            Alert.alert('Erro', 'Os campos de nome e usuário são obrigatórios.');
            return;
        }

        const updateData = {
            user: {
                login: username,
                name: name,
            },
        };

        try {
            const response = await fetch(`https://api.papacapim.just.pro.br/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                
                await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

                Alert.alert('Sucesso', 'Nome e usuário atualizados com sucesso!');
                router.push('/');
            } else {
                Alert.alert('Erro', 'Não foi possível atualizar o nome e usuário.');
            }
        } catch (error) {
            Alert.alert('Erro', 'Algo deu errado. Tente novamente mais tarde.');
        }
    };

    const handleSavePassword = async () => {
        if (!password || !confirmPassword) {
            Alert.alert('Erro', 'Os campos de senha e confirmação de senha são obrigatórios.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erro', 'As senhas não correspondem.');
            return;
        }

        const updateData = {
            user: {
                password: password,
                password_confirmation: confirmPassword,
            },
        };

        try {
            const response = await fetch(`https://api.papacapim.just.pro.br/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                Alert.alert('Sucesso', 'Senha atualizada com sucesso!');
                setPassword('');
                setConfirmPassword('');
            } else {
                Alert.alert('Erro', 'Não foi possível atualizar a senha.');
            }
        } catch (error) {
            Alert.alert('Erro', 'Algo deu errado. Tente novamente mais tarde.');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const response = await fetch(`https://api.papacapim.just.pro.br/users/${userId}`, {
                method: 'DELETE',
            });

            console.log(response);

            if (response.ok) {
                Alert.alert('Sucesso', 'Conta excluída com sucesso!');
                await AsyncStorage.removeItem('user');
                router.push('/login');
            } else {
                Alert.alert('Erro', 'Não foi possível excluir a conta.');
            }
        } catch (error) {
            Alert.alert('Erro', 'Algo deu errado. Tente novamente mais tarde.');
        }
    };

    return (
        <>
            <Stack.Screen options={{ title: 'Editar perfil' }} />
            <View style={styles.container}>
                <Text style={{ color: Colors[colorScheme ?? 'light'].text }}>Nome</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    value={name}
                    onChangeText={setName}
                />
                <Text style={{ color: Colors[colorScheme ?? 'light'].text }}>Usuário</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Usuário"
                    value={username}
                    onChangeText={setUsername}
                />
                <TouchableOpacity style={styles.button} onPress={handleSaveNameAndUsername}>
                    <Text style={styles.buttonText}>Salvar Nome e Usuário</Text>
                </TouchableOpacity>

                <Text style={{ marginTop: 20, color: Colors[colorScheme ?? 'light'].text }}>Senha</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <Text style={{ color: Colors[colorScheme ?? 'light'].text }}>Confirme a Senha</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Confirme a Senha"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                <TouchableOpacity style={styles.button} onPress={handleSavePassword}>
                    <Text style={styles.buttonText}>Salvar Senha</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteAccount}>
                    <Text style={[styles.buttonText, styles.deleteButtonText]}>Excluir Conta</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 6,
        marginTop: 10,
        width: '100%',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        padding: 10,
        textAlign: 'center',
        backgroundColor: '#007BFF',
        borderRadius: 6,
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
        marginTop: 20,
    },
    deleteButtonText: {
        backgroundColor: '#FF3B30',
    },
    container: {
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: '#222222',
        marginBottom: 16,
        paddingLeft: 8,
        borderWidth: 1,
        borderRadius: 6,
        marginTop: 8,
    },
});

export default EditProfileScreen;
