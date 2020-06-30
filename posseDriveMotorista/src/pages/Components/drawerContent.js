import React, {useState, useEffect} from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'

import AsyncStorage from '@react-native-community/async-storage';
import {MaterialIcons as Icon} from '@expo/vector-icons';

export function DrawerContent() {

  const navigation = useNavigation()

  const [dadosDriver, setDadosDriver] = useState({
      name: '',
      fone: '',
      carro: '',
      placa: ''
  })


  async function getDadosDriver(){
    const name = await AsyncStorage.getItem('nameUser@possedrivemotorista')
    const fone = await AsyncStorage.getItem('foneUser@possedrivemotorista')
    const placa = await AsyncStorage.getItem('placaUser@possedrivemotorista')
    const carro = await AsyncStorage.getItem('carroUser@possedrivemotorista')

    setDadosDriver({
      name,
      fone,
      carro,
      placa
    })
  }
  useEffect(() => {getDadosDriver()}, [])

  async function signOut(){
    await AsyncStorage.removeItem("idUser@possedrivemotorista")
    await AsyncStorage.removeItem("nameUser@possedrivemotorista")
    await AsyncStorage.removeItem("emailUser@possedrivemotorista")
    await AsyncStorage.removeItem("foneUser@possedrivemotorista")
    await AsyncStorage.removeItem("placaUser@possedrivemotorista")
    await AsyncStorage.removeItem("carroUser@possedrivemotorista")
    navigation.navigate('Login')
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
}

return (
  <View style={styles.container}>
    <View style={styles.sectionTop}>
      <View style={styles.perfilLabel}>
        <Icon name="account-circle" color="#999" size={60} />
        {dadosDriver?
        <View style={styles.nameLabel}>
          <Text style={styles.text}>
              {dadosDriver.name}
          </Text>
          <Text style={styles.text2}>
              {dadosDriver.carro} - {dadosDriver.placa}
          </Text>
        </View>
        :null}
      </View>

      <View style={styles.menuLabel}>
        <TouchableOpacity style={styles.menu} onPress={() => navigation.navigate('Inicio')}>
            <Icon name="home" color="#999" size={20} />
            <Text style={styles.textMenu}>Home</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuLabel}>
        <TouchableOpacity style={styles.menu} onPress={() => navigation.navigate('Historic')}>
            <Icon name="history" color="#999" size={20} />
            <Text style={styles.textMenu}>Histórico</Text>
        </TouchableOpacity>
      </View>

    </View>
    <View style={styles.sectionBottom}>
      <TouchableOpacity onPress={() => signOut()} style={styles.signoutLabel}>
        <Icon name="power-settings-new" color="#999" size={20} />
        <Text style={styles.signoutText} >SignOut</Text>
      </TouchableOpacity>
    </View>
  </View>
)

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
    paddingTop: 40,
    backgroundColor: '#000',
    justifyContent: 'space-between'
  },

  sectionTop: {
  },

  sectionBottom: {
    height: 60,
    justifyContent: 'center',
    borderTopColor: '#424242',
    borderTopWidth: 0.5,
    borderBottomColor: '#424242',
    borderBottomWidth: 0.5,
  },

  signoutLabel: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },

  signoutText: {
    paddingLeft: 15,
    color: '#999'
  },

  perfilLabel: {
    flexDirection: 'row',
    paddingLeft: 15,
    marginBottom: 20,
  },

  nameLabel: {
    paddingLeft: 10,
    width: '80%',
    justifyContent: 'center'
  },

  text: {
    width: '90%',
    color: '#999'
  },

  text2: {
    fontSize: 10,
    width: '90%',
    color: '#555'
  },

  menu: {
    marginLeft: 15,
    marginTop: 10,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },

  textMenu: {
    fontWeight: 'bold',
    paddingLeft: 10,
    color: '#999',
    fontSize: 16,
  }

})
