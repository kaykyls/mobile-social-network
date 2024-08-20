import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter, Link } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();
    const colorScheme = useColorScheme();

    const handleRegister = () => {
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
            <Text style={{color: Colors[colorScheme ?? 'light'].text}}>Confirmar Senha</Text>
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
                <Text style={{color: Colors[colorScheme ?? 'light'].text, textAlign: 'center'}}>Já possui uma conta? <Link style={styles.loginLink} href="/login">Login</Link></Text>
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
    label: {
        fontSize: 16,
        marginBottom: 4,
        color: '#FFFFFF',
    },
    loginText: {
        color: '#FFFFFF',
        textAlign: 'center',
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
        marginTop: 4
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
});

export default RegisterScreen;