import React, {useState, useEffect} from 'react'
import { Text, View, TextInput, ScrollView,  TouchableOpacity, SafeAreaView, ActivityIndicator} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-community/async-storage'
import {MaterialIcons as Icon} from '@expo/vector-icons';

import api from '../../../services/api';

import styles from './styles'

const Register = () => {
    const navigation = useNavigation()

    const [name, setName] = useState<String>('')
    const [email, setEmail] = useState<String>('')
    const [fone, setFone] = useState<String>('')
    const [cpf, setCpf] = useState<String>('')
    const [cnh, setCnh] = useState<String>('')
    const [carro, setCarro] = useState<String>('')
    const [placa, setPlaca] = useState<String>('')
    const [renavam, setRenavam] = useState<String>('')
    const [key, setKey] = useState<String>('')
    const [keyAgain, setKeyAgain] = useState<String>('')

    const [erro, setErro] = useState<String>('')
    const [seePass, setSeePass] = useState<Boolean>(true)
    const [seePass2, setSeePass2] = useState<Boolean>(true)
    const [indicator, setIndicator] = useState<Boolean>(false)

    async function cadastrar() {
        setIndicator(true)

        const time = setTimeout(() => {
          cadastrar()
        }, 10000)

        
        if (name && email && fone && cpf && cnh && carro && placa && renavam && key) {
        if (key === keyAgain) {
            if (name.length > 8) {
            if (key.length > 5) {
                const response = await api.post('userDrive/create', {
                name,
                email,
                fone,
                cpf: cpf,
                cnh: cnh,
                carro: carro,
                placa: placa,
                renavam: renavam,
                password: key,
                })
                const { user, error } = response.data

                if (user){
                  
                clearTimeout(time)

                await AsyncStorage.multiSet([
                ["idUser@possedrivemotorista", String(user._id)],
                ["nameUser@possedrivemotorista", String(user.name)],
                ["emailUser@possedrivemotorista", String(user.email)],
                ["foneUser@possedrivemotorista", String(user.fone)],
                ["placaUser@possedrivemotorista", String(user.placa)],
                ["carroUser@possedrivemotorista", String(user.carro)]
                ])

                navigation.navigate('Home')
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Home' }],
                });
                
                } else if (error){
                  setErro(error)
                  clearTimeout(time)
                }

            } else { 
              setErro('Senha muito curta!') 
              clearTimeout(time)
            }
            } else { 
              setErro('Nome muito curto!') 
              clearTimeout(time)
            }
        } else { 
          setErro('Senhas não conferem!')
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


        <ScrollView style={styles.scrollSection} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>


          <View style={styles.label}>

            <View style={styles.inputLabel}>

              <Icon name="person" size={22} color="#888" />

              <TextInput
                style={styles.inputText}
                keyboardType="default"
                placeholder="Nome completo"
                placeholderTextColor="#424242"
                autoCorrect={false}
                maxLength={60}
                value={String(name)}
                onChangeText={setName}
              />
            </View>

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

              <Icon name="call" size={22} color="#888" />
                <TextInput
                style={styles.inputText}
                keyboardType="numeric"
                placeholder="Telefone com DDD"
                placeholderTextColor="#424242"
                autoCorrect={false}
                maxLength={11}
                value={String(fone)}
                onChangeText={setFone}
              />
            </View>

            <View style={styles.inputLabel}>

            <Icon name="subtitles" size={22} color="#888" />
            <TextInput
              style={styles.inputText}
              placeholder="CPF - apenas números"
              keyboardType={'numeric'}
              placeholderTextColor="#424242"
              maxLength={11}
              value={String(cpf)}
              onChangeText={setCpf}
            />
            </View>

            <View style={styles.inputLabel}>

            <Icon name="subtitles" size={22} color="#888" />
            <TextInput
              style={styles.inputText}
              placeholder="CNH - apenas números"
              keyboardType={'numeric'}
              placeholderTextColor="#424242"
              maxLength={11}
              value={String(cnh)}
              onChangeText={setCnh}
            />
            </View>

            <View style={styles.inputLabel}>

            <Icon name="directions-car" size={22} color="#888" />
            <TextInput
              style={styles.inputText}
              placeholder="Marca e modelo do veiculo"
              autoCorrect={false}
              placeholderTextColor="#424242"
              maxLength={20}
              value={String(carro)}
              onChangeText={setCarro}
            />
            </View>

            <View style={styles.inputLabel}>

            <Icon name="subtitles" size={22} color="#888" />
            <TextInput
              style={styles.inputText}
              autoCapitalize='characters'
              placeholder="Placa do veiculo"
              placeholderTextColor="#424242"
              autoCorrect={false}
              maxLength={7}
              value={String(placa)}
              onChangeText={setPlaca}
            />
            </View>

            <View style={styles.inputLabel}>

            <Icon name="subtitles" size={22} color="#888" />
            <TextInput
              style={styles.inputText}
              placeholder="Renavam"
              placeholderTextColor="#424242"
              keyboardType={'numeric'}
              maxLength={11}
              value={String(renavam)}
              onChangeText={setRenavam}
            />
            </View>

            <View style={styles.inputLabel}>

              <Icon name="lock" size={22} color="#888" />
              <TextInput
                style={styles.inputText}
                autoCapitalize="none"
                keyboardType="default"
                secureTextEntry={Boolean(seePass)}
                placeholder="Senha"
                placeholderTextColor="#424242"
                autoCorrect={false}
                maxLength={30}
                value={String(key)}
                onChangeText={setKey}
              />

              <TouchableOpacity
                style={styles.eye}
                onPress={() => setSeePass(!seePass)}>
                <Icon name="visibility-off" size={22} color="#555" />
              </TouchableOpacity>
            </View>
            <View style={styles.inputLabel}>

              <Icon name="lock" size={22} color="#888" />
              <TextInput
                style={styles.inputText}
                autoCapitalize="none"
                keyboardType="default"
                secureTextEntry={Boolean(seePass2)}
                placeholder="Repita a senha"
                placeholderTextColor="#424242"
                autoCorrect={false}
                maxLength={30}
                value={String(keyAgain)}
                onChangeText={setKeyAgain}
              />

              <TouchableOpacity
                style={styles.eye}
                onPress={() => setSeePass2(!seePass2)}>
                <Icon name="visibility-off" size={22} color="#555" />
              </TouchableOpacity>
            </View>
          </View>

        </View>

    </ScrollView>
    <TouchableOpacity
            style={styles.button}
            onPress={() => cadastrar()}>
            <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
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

export default Register