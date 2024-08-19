import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const MyComponent = () => {
    const [name, setName] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleSave = () => {
        
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
                style={styles.input}
                placeholder="Nome"
                value={name}
                onChangeText={setName}
            />
            <Text style={styles.label}>Usuário</Text>
            <TextInput
                style={styles.input}
                placeholder="Usuário"
                value={username}
                onChangeText={setUsername}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <Text style={styles.label}>Senha</Text>
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
    label: {
        marginBottom: 8,
        fontSize: 16,
        color: '#FFFFFF',
    },
    input: {
        height: 40,
        borderColor: '#222222',
        marginBottom: 16,
        paddingLeft: 8,
        borderWidth: 1,
        borderRadius: 6,
    },
});

export default MyComponent;