import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useRouter, Link, Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();
    const colorScheme = useColorScheme();

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Erro', 'As senhas não correspondem.');
            return;
        }

        const registerData = {
            user: {
                login: email,
                name: name,
                password: password,
                password_confirmation: confirmPassword,
            },
        };

        try {
            const response = await fetch('https://api.papacapim.just.pro.br/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),
            });

            if (response.ok) {
                const data = await response.json();
                Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
                
                router.push('/login');
            } else {
                Alert.alert('Erro', 'Registro falhou. Verifique os dados e tente novamente.');
            }
        } catch (error) {
            Alert.alert('Erro', 'Algo deu errado. Tente novamente mais tarde.');
        }
    };

    return (
        <>
            <Stack.Screen options={{ title: 'Registrar', headerShown: false }} />
            <View style={styles.container}>
                <Text style={{ color: Colors[colorScheme ?? 'light'].text }}>Nome</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    value={name}
                    onChangeText={setName}
                />
                <Text style={{ color: Colors[colorScheme ?? 'light'].text }}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />
                <Text style={{ color: Colors[colorScheme ?? 'light'].text }}>Senha</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <Text style={{ color: Colors[colorScheme ?? 'light'].text }}>Confirmar Senha</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Confirmar Senha"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Registrar</Text>
                </TouchableOpacity>
                <View style={styles.loginText}>
                    <Text style={{ color: Colors[colorScheme ?? 'light'].text, textAlign: 'center' }}>
                        Já possui uma conta?{' '}
                        <Link style={styles.loginLink} href="/login">
                            Login
                        </Link>
                    </Text>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    loginText: {
        color: '#FFFFFF',
        marginTop: 16,
    },
    loginLink: {
        color: '#007BFF',
        textDecorationLine: 'underline',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        borderRadius: 6,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        width: '100%',
        marginTop: 4,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
});

export default RegisterScreen;
