import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const MyComponent = () => {
    const [name, setName] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const colorScheme = useColorScheme();

    const handleSave = () => {
        
    };

    return (
        <View style={styles.container}>
            <Text style={{color: Colors[colorScheme ?? 'light'].text}}>Nome</Text>
            <TextInput
                style={styles.input}
                placeholder="Nome"
                value={name}
                onChangeText={setName}
            />
            <Text style={{color: Colors[colorScheme ?? 'light'].text}}>Usuário</Text>
            <TextInput
                style={styles.input}
                placeholder="Usuário"
                value={username}
                onChangeText={setUsername}
            />
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
            <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 6,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        padding: 10,
        textAlign: 'center',
        backgroundColor: '#007BFF',
        borderRadius: 6,
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
        marginTop: 8
    },
});

export default MyComponent;