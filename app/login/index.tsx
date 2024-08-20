import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter, Link } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const colorScheme = useColorScheme();

    const handleLogin = () => {
        router.push('/');
    };

    return (
        <View style={styles.container}>
            <Text style={{color: Colors[colorScheme ?? 'light'].text}}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <Text style={{color: Colors[colorScheme ?? 'light'].text}}>Senha</Text>
            <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>  
            </TouchableOpacity>
            <View style={styles.registerText}>
                <Text style={{color: Colors[colorScheme ?? 'light'].text, textAlign: 'center'}}>Não possui uma conta? <Link style={styles.registerLink} href="/register">Registrar-se</Link></Text>
            </View>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    registerText: {
        color: '#FFFFFF',
        marginTop: 16,
    },
    registerLink: {
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
        marginTop: 4
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        width: '100%',
        marginTop: 4
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
});

export default LoginScreen;
