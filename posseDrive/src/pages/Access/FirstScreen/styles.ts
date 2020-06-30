import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({

    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#000',
        paddingVertical: 25,
    },

    title: {
        paddingTop: 25,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#999',
    },

    labelTexto: {
        alignItems: 'center',
        width: '80%',
        height: 60,
        justifyContent: 'center',
        borderRadius: 15,
    },

    texto: {
        fontSize: 14,
        textAlign: 'center',
        color: '#999',
        fontWeight: 'bold',
    },

    texto2: {
        fontSize: 12,
        textAlign: 'center',
        color: '#999',
    },

    buttons: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '80%',
    },

    buttonLogin: {
        elevation: 1,
        width: '45%',
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        borderRadius: 20,
        borderColor: '#72B76B',
        borderWidth: 0.8,
    },

    buttonLoginText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#72B76B',
    },

    buttonRegister: {
        elevation: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '45%',
        backgroundColor: '#999',
        borderRadius: 20,
        padding: 12,
    },

    buttonRegisterText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#000',
    },

    image: {
        width: 200,
        height: 200,
    }
})

export default styles