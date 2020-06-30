import React, {useState, useEffect} from 'react'
import { Text, View, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-community/async-storage'
import {MaterialIcons as Icon} from '@expo/vector-icons';
import api from '../../../services/api';

import styles from './styles'

const Login = () => {
    const navigation = useNavigation()
    
  const [email, setEmail] = useState<String>('')
  const [password, setPassword] = useState<String>('')
  const [erro, setErro] = useState<String>('')
  const [seePass, setSeePass] = useState<Boolean>(true)

  const [indicator, setIndicator] = useState<Boolean>(false)

  async function logar() {
    setIndicator(true)

    const time = setTimeout(() => {
      logar()
    }, 10000)

    if (email && password) {
      const response = await api.post('userDrive/login', {
        email,
        password,
      })
      const { user, error } = response.data

      if (user) {
        clearTimeout(time)
        await AsyncStorage.multiSet([
          ["idUser@possedrivemotorista", user._id],
          ["nameUser@possedrivemotorista", user.name],
          ["emailUser@possedrivemotorista", user.email],
          ["foneUser@possedrivemotorista", user.fone],
          ["placaUser@possedrivemotorista", user.placa],
          ["carroUser@possedrivemotorista", user.carro]
        ])

        navigation.navigate('Home')
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });

      } else if (error) {
        setErro(error)
        clearTimeout(time)
      }
    } else {
      setErro('Preencha todos os campos!')
      clearTimeout(time)
    }
  }

  useEffect(()=>{
    if(erro){
      setTimeout(() => {
        setIndicator(false)
        setErro("")
      }, 2000);
    }
  },[erro])

    return(
    <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Icon name="chevron-left" size={40} color="#999" style={styles.back} 
            onPress={()=>navigation.navigate('FirstScreen')}/>
          </View>

        <View style={styles.section}>


          <View style={styles.label}>
            <View style={styles.inputLabel}>

              <Icon name="email" size={22} color="#888" />

              <TextInput
                style={styles.inputText}
                autoCapitalize="none"
                //autoFocus={true}
                keyboardType="email-address"
                placeholder="Email"
                placeholderTextColor="#424242"
                autoCorrect={false}
                maxLength={60}
                value={String(email)}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputLabel}>

              <Icon name="lock" size={22} color="#888" />

              <TextInput
                style={styles.inputText}
                keyboardType={'default'}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={Boolean(seePass)}
                placeholder="Senha"
                placeholderTextColor="#424242"
                maxLength={30}
                value={String(password)}
                onChangeText={setPassword}
              />

              <TouchableOpacity
                style={styles.eye}
                onPress={() => setSeePass(!seePass)}>
                <Icon name="visibility-off" size={22} color="#555"/>
              </TouchableOpacity>

            </View>
          </View>

        </View>

          <View  style={styles.labelButton}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => logar()}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
          </View>
      </View>

        {erro?
            <View style={styles.erroLabel}>
              <Text style={styles.erro}>{erro}</Text>
            </View>
            :
              indicator?<ActivityIndicator size="large" color="#72B76B" style={styles.indicator}/>:null
          }

    </SafeAreaView>
    )
}

export default Login