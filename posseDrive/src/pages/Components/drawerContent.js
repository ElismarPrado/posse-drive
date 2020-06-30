import React, {useState, useEffect} from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'

import AsyncStorage from '@react-native-community/async-storage';
import {MaterialIcons as Icon} from '@expo/vector-icons';

export function DrawerContent() {

  const navigation = useNavigation()

  const [dadosUser, setDadosUser] = useState({
    name: '',
    fone: ''
})

  async function getDadosUser(){
    const name = await AsyncStorage.getItem('nameUser@possedrive')
    const fone = await AsyncStorage.getItem('foneUser@possedrive')

    setDadosUser({ name, fone })
  }
  useEffect(() => {getDadosUser()}, [])


  async function signOut(){
    await AsyncStorage.removeItem("idUser@possedrive")
    await AsyncStorage.removeItem("nameUser@possedrive")
    await AsyncStorage.removeItem("emailUser@possedrive")
    await AsyncStorage.removeItem("foneUser@possedrive")
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
        {dadosUser ?
        <View style={styles.nameLabel}>
          <Text style={styles.text}>
              {dadosUser.name}
          </Text>
          <Text style={styles.text}>
              {dadosUser.fone}
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
    width: '95%',
    color: '#999'
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
