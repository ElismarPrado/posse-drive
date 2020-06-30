import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-community/async-storage'

import styles from './styles'
import Fundo from '../../../assets/fundo.png'

const FirstScreen = () => {
    const navigation = useNavigation()

    const [state, setState] = useState<Boolean>(false)

    async function getDateAsync(){
        const id = await AsyncStorage.getItem('idUser@possedrivemotorista');
        const nome = await AsyncStorage.getItem('nameUser@possedrivemotorista');
        if(id){
          if(nome){
            navigation.navigate('Home')
          }else{
            navigation.navigate('Login')
          }
        }else{
          setState(true)
        }
    }
    useEffect(()=>{getDateAsync()},[])


    if(!state) {
        return null
    }
    
    return(
    <SafeAreaView style={{flex: 1}}> 
        <View style={styles.container}>
            
              <Text style={styles.title}>POSSE DRIVE</Text>

            <View style={styles.labelTexto}>
            <Text style={styles.texto}>Ganhe uma grana extra</Text>
            <Text style={styles.texto2}>Faça seus horários</Text>
            <Text style={styles.texto2}>Dirija para o PosseDrive</Text>
            </View>
            <View style={styles.buttons}>

            <TouchableOpacity
            style={styles.buttonRegister}
            onPress={() => navigation.navigate('Register')}>
            <Text style={styles.buttonRegisterText}>Cadastrar</Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={styles.buttonLogin}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonLoginText}>Entrar</Text>
            </TouchableOpacity>

            </View>
        </View>
    </SafeAreaView>
    )
}

export default FirstScreen