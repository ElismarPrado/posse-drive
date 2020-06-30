import React, { useState, useEffect, Fragment } from 'react'
import { Platform, SafeAreaView, Linking, Alert, View, Text, Image, Switch, TouchableOpacity, ActivityIndicator } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import * as Location from 'expo-location'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-community/async-storage'
import {MaterialIcons as Icon} from '@expo/vector-icons'
import io from 'socket.io-client'
import api from '../../services/api'
import styles from './styles'
import { Notifications } from 'expo'

const API_URL = 'http://3.23.146.65:3000' 
const GOOGLE_API_KEY = 'Chave google'


export default function Home() {
  const navigation = useNavigation()

  const [indicator, setIndicator] = useState(false)
  const [indicator2, setIndicator2] = useState(false)

  const [date, setDate] = useState('')
  const [dateCall, setDateCall] = useState()
  const [showLabel, setShowLabel] = useState(0)

  const [state, setState] = useState()
  const [mapView, setMapView]= useState()
  const [position, setPosition] = useState({
    latitude: "",
    longitude: ""
  })

  const [origin, setOrigin] = useState({
    latitude: '',
    longitude: ''
  })
  const [destination, setDestination] = useState({
    latitude: '',
    longitude: ''
  })

  async function getDate(){
    const idDriver = await AsyncStorage.getItem('idUser@possedrivemotorista');
    const response = await api.get(`call/getIdDriver?idDriver=${idDriver}`)
    const dados = response.data[0]

    if(dados){
    setDate(dados)
    dados.status === 'ACEITO' ?
      setShowLabel(1)
    :dados.status === 'CHEGOU-USER' ?
      setShowLabel(2)
    :dados.status === 'COM-USER' ?
      setShowLabel(3)
    :dados.status === 'CANCELADO-USER' ? (
      setShowLabel(0),
      setDestination({latitude: '', longitude: ''}),
      setOrigin({latitude: '', longitude: ''})
    )
    :null
    }

  }
  useEffect(() => {getDate()}, [])

  async function changeState(){
    setState(!state)
    await AsyncStorage.setItem('state@possedrivemotorista', `${!state}`);
  }

  async function getDateAsync(){
    const estado = await AsyncStorage.getItem('state@possedrivemotorista');
    let estados
    estado == 'true'?estados = true:estados = false
    setState(estados)
  }
  useEffect(()=>{getDateAsync()},[])

// Obtem a posição atual do GPS-------------------------------------------------------------------------  
useEffect(() => {
  async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync()
      if(status !== 'granted') {
          Alert.alert('Oooops...', 'Precisamos de sua permissão para obter a localização')
      }
      const location = await Location.getCurrentPositionAsync()
      const { latitude, longitude } = location.coords
      setPosition({ latitude, longitude })
  }
  loadPosition()
  }, [])
  // Obtem a posição atual do GPS--------------------------------------------------------------------------

  //notificação--------------------------------------------------------------------------
  if (Platform.OS === 'android') {
    Notifications.createChannelAndroidAsync('posse-drive-motorista', {
      name: 'posse drive motorista',
      sound: true,
    });
  }

 function not(msg){
    const localNotification = {
      title: msg,
      body: '', // (string) — body text of the notification.
      ios: { // (optional) (object) — notification configuration specific to iOS.
        sound: true // (optional) (boolean) — if true, play a sound. Default: false.
      },
      android: // (optional) (object) — notification configuration specific to Android.
      {
        sound: true, // (optional) (boolean) — if true, play a sound. Default: false.
        //icon (optional) (string) — URL of icon to display in notification drawer.
        //color (optional) (string) — color of the notification icon in notification drawer.
        priority: 'max', // (optional) (min | low | high | max) — android may present notifications according to the priority, for example a high priority notification will likely to be shown as a heads-up notification.
        sticky: false, // (optional) (boolean) — if true, the notification will be sticky and not dismissable by user. The notification must be programmatically dismissed. Default: false.
        vibrate: true, // (optional) (boolean or array) — if true, vibrate the device. An array can be supplied to specify the vibration pattern, e.g. - [ 0, 500 ].
        // link (optional) (string) — external link to open when notification is selected.
        channelId: 'posse-drive-motorista',
      },
      _displayInForeground: true,
    };

    let t = new Date();
    t.setSeconds(t.getSeconds() + 10);
    const schedulingOptions = {
      time: t, // (date or number) — A Date object representing when to fire the notification or a number in Unix epoch time. Example: (new Date()).getTime() + 1000 is one second from now.
    };
       Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions);
    }
  //notificação--------------------------------------------------------------------------

//Conexão de socket.io --------------------------------------------------------------------------------
async function socket() {
  const id = await AsyncStorage.getItem('idUser@possedrivemotorista');
  const socket = io(API_URL, {
    query: {user: id},
  });
    socket.on('canal', date => {
      date.id === 'all-drivers' && date.msg === 'newcall'
          getDateCall()
    })

    socket.on('canal', date => {
      date.id === 'all-drivers' && date.msg === 'atualiza'
          getDate()
          getDateCall()
    })

    socket.on('canal', date => {
      date.id === 'all-drivers' && date.msg === 'cancelar'
          getDateCall()
          getDate()
    })

    socket.on('refresh', date => {
          markerDrivers()
    })
}
useEffect(() => {socket()}, []);
//Conexão de socket.io --------------------------------------------------------------------------------


async function markerDrivers(){
  const location = await Location.getCurrentPositionAsync()
  const { latitude, longitude } = location.coords

  const idDriver = await AsyncStorage.getItem('idUser@possedrivemotorista')
  const name = await AsyncStorage.getItem('nameUser@possedrivemotorista')

  const dados = {
    id: idDriver,
    name,
    lat: latitude,
    lgt: longitude
  }

  const array = []
  const array2 = []
  const response = await api.get('marker/get')

  const id = response.data[0]._id
  response.data.map(dado => (
    dado.date.map(date => (
      array.push(date.id)
    )),
    array2.push(...dado.date, dados)
  ))

  array.includes(idDriver)
  ?null
  :await api.put(`marker/update/${id}`, {
    date: array2
  })
}

async function getDateCall(){

  const id = await AsyncStorage.getItem('idUser@possedrivemotorista');

  const response = await api.get('call/getStatus?status=AGUARDANDO')
  setDateCall(response.data[0])

    if(response.data[0]){

      const receiveCall = response.data[0].receiveCall

      const array = []
      response.data[0].receiveCall.map(date => array.push(date))
      const array2 = [...array, id]

      if(receiveCall.includes(id)){
      }else{

      const location = await Location.getCurrentPositionAsync()
      const { latitude, longitude } = location.coords

      const minlat = response.data[0].minLatitude
      const maxlat = response.data[0].maxLatitude
      const minlgt = response.data[0].minLongitude
      const maxlgt = response.data[0].maxLongitude


      const mylat = latitude.toFixed(4)
      const mylgt = longitude.toFixed(4)
      if((mylat<=minlat && mylat>=maxlat) && (mylgt<=minlgt && mylgt>=maxlgt)){
        getDate()
        getDateCall()
        not('Chegou uma solicitacao de viagem')
        await api.put(`call/updateReceiveCall/${response.data[0]._id}` ,{
          receiveCall: array2
        })
      }
    }
    }
}
useEffect(() => {getDateCall()}, [])


async function acept(id, idUser){
  setIndicator(true)

  const responseState = await api.get(`call/get/${id}`)
  const state = responseState.data.status

  if(state === "AGUARDANDO"){
  const response = await api.put(`call/updateStatus/${id}`, { status: 'ACEITO'})
  const {success, error} = response.data

  const location = await Location.getCurrentPositionAsync()
  const { latitude, longitude } = location.coords

  const idDriver = await AsyncStorage.getItem('idUser@possedrivemotorista')
  const name = await AsyncStorage.getItem('nameUser@possedrivemotorista')
  const fone = await AsyncStorage.getItem('foneUser@possedrivemotorista')
  const placa = await AsyncStorage.getItem('placaUser@possedrivemotorista')
  const carro = await AsyncStorage.getItem('carroUser@possedrivemotorista')

  const responseCall = await api.get(`call/get/${id}`)
  const dados = responseCall.data

  await api.put(`call/updateDriver/${id}`, {
    idDriver: idDriver,
    nameDriver: name,
    foneDriver: fone,
    latDriver: latitude,
    lgtDriver: longitude,
    placa,
    carro,
  })
  
  if(success){
  if(dados){
    setOrigin({ latitude, longitude })
    setDestination({ latitude: Number(dados.latitude), longitude: Number(dados.longitude) })
  }

    await api.get(`canal/${idUser}/aceito`)
    setShowLabel(1)
    getDate()
    getDateCall()
    setIndicator(false)
  }else if(error){
    alert('Opss. ouve um erro, favor reinicie o app!')
  }
  }else{
    setShowLabel(0)
    getDate()
    getDateCall()
    setIndicator(false)
    alert('Solicitação aceita por outro motorista, seja mais rápido na próxima!')
}
}

async function changeStatus(id, fase, idUser){

  if(fase === 2){
    setIndicator2(true)
    const response = await api.put(`call/updateStatus/${id}`, { status: 'CHEGOU-USER'})
    await api.get(`canal/${idUser}/chegou-user`)

    const {success, error} = response.data
    if(success){
    setDestination({latitude: '', longitude: ''})
    setOrigin({latitude: '', longitude: ''})
    setShowLabel(2) 
    setIndicator2(false)
    }else if(error){
      alert('Opss. ouve um erro, favor reinicie o app!')
    }
  }
  else if(fase === 3){
  setIndicator2(true)
  const location = await Location.getCurrentPositionAsync()
  const { latitude, longitude } = location.coords

  const response = await api.put(`call/updateStatus/${id}`, { status: 'COM-USER'})
  await api.get(`canal/${idUser}/com-user`)

  const {success, error} = response.data
  if(success){
  setDestination({latitude: date.latitudeDestino, longitude: date.longitudeDestino})
  setOrigin({latitude, longitude})
  setShowLabel(3) 
  setIndicator2(false)
  }else if(error){
    alert('Opss. ouve um erro, favor reinicie o app!')
  }
  }
  else if(fase === 4){
    setIndicator2(true)
    const idDriver = await AsyncStorage.getItem('idUser@possedrivemotorista')
    const newIdDriver = `concluido-${idDriver}`
    const response = await api.put(`call/updateStatus/${id}`, { status: 'CONCLUIDO'})

    const {success, error} = response.data
    if(success){
    await api.put(`call/updateIdDriver/${id}`, { idDriver: newIdDriver })
    await api.get(`canal/${idUser}/concluido`)
    setDestination({latitude: '', longitude: ''})
    setOrigin({latitude: '', longitude: ''})
    setShowLabel(0) 
    setIndicator2(false)
    {date.valor ? alert(`Viagem concluida, receba do cliente: R$ ${Number(date.valor).toFixed(2).replace(".", ",")}`):null}
    }else if(error){
    alert('Opss. ouve um erro, favor reinicie o app!')
  }
  }
}

function cancelar(id, idUser, idDriver){
  Alert.alert(
    'CONFIRMAÇÃO',
    'Deseja realmente cancelar?',
    [
      {text: 'NÃO', onPress: () => console.warn('Solicitação Cancelada'), style: 'cancel'},
      {text: 'SIM', onPress: () =>  cancelarConfirm(id, idUser, idDriver)},
    ]
  )
  }

  async function cancelarConfirm(id, idUser, idDriver){
      const newIdDriver = `cancelado-${idDriver}`
      await api.put(`call/updateIdDriver/${id}`, { idDriver: newIdDriver })

      const response = await api.put(`call/updateStatus/${id}`, {
        status: 'CANCELADO-DRIVER'
      })

      const { success, error } = response.data

      if(success){
        setShowLabel(0),
        setDestination({latitude: '', longitude: ''}),
        setOrigin({latitude: '', longitude: ''})
        await api.get(`canal/${idUser}/cancelar`)
      }
      else if(error){
        alert('Opss, ocorreu um erro, tente cancelar novamente!')
      }
  }

function labelCall(){
  return(
    <View style={styles.sectionCall}>
    <View style={styles.labelCall}>
        <Text style={styles.titleCall}>NOVA VIAGEM</Text>
          {dateCall?<Text style={styles.distanceCall}>Percurso de {dateCall.distance} km</Text>:null}
        <View style={styles.labelButtonCall}>
          <TouchableOpacity onPress={() => acept(dateCall._id, dateCall.idUser) } style={styles.buttonCall}>
            <ActivityIndicator color="#72B76B" size={130} style={styles.progress} />
            <Text style={styles.buttonCallText}>ACEITAR</Text>
          </TouchableOpacity>
        </View>
    </View>
    </View>
    
  )
}

function label1(){
  return(
    date ?
    <View style={styles.section1}>
      <View style={styles.label1}>
        <View>
        <Text style={styles.label1Text}>{date.name}</Text>
        <TouchableOpacity
            onPress={()=> Linking.openURL(`tel://${date.fone}`)}>
            <Text style={styles.label1Fone}>{date.fone}</Text>
        </TouchableOpacity>
        </View>
        <View>
        <Text style={styles.label1Text}>{date.hour}:{date.min}</Text>
        <Text style={styles.label1Text}>Percurso: {date.distance} km</Text>
        </View>

        <TouchableOpacity
          style={styles.routeWaze}
          onPress={()=>Linking.openURL(`geo:${date.latitude},${date.longitude}`)}>
          <Text style={styles.routeWazeText}>WAZE</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => changeStatus(date._id, 2, date.idUser)} style={styles.button} >
        <Text style={styles.buttonText}>Cheguei no cliente</Text>
      </TouchableOpacity>

    </View>
    :null
  )
}

function label2(){
  return(
    date &&
    <View style={styles.section1}>
      <Text style={styles.titleAdviser}>Aguarde o cliente</Text>
      <View style={styles.label1}>
        <View>
        <Text style={styles.label1Text}>{date.name}</Text>
        <TouchableOpacity
            onPress={()=> Linking.openURL(`tel://${date.fone}`)}>
            <Text style={styles.label1Fone}>{date.fone}</Text>
        </TouchableOpacity>
        </View>
        <View>
        <Text style={styles.label1Text}>{date.hour}:{date.min}</Text>
        <Text style={styles.label1Text}>Percurso: {date.distance} km</Text>
        </View>
      </View>

      <View style={styles.buttonLabel}>
      <TouchableOpacity 
      onPress={() => changeStatus(date._id, 3, date.idUser)} style={styles.button} >
        <Text style={styles.buttonText}>Cliente embarcou</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => cancelar(date._id, date.idUser, date.idDriver)} style={styles.button2} >
        <Text style={styles.buttonText2}>Cancelar</Text>
      </TouchableOpacity>
      </View>

    </View>
  )
}

function label3(){
  return(
    date &&
    <View style={styles.section1}>
      <Text style={styles.titleAdviser}>Siga para o destino</Text>
      <View style={styles.label1}>
        <View>
        <Text style={styles.label1Text}>{date.name}</Text>
        <TouchableOpacity
            onPress={()=> Linking.openURL(`tel://${date.fone}`)}>
            <Text style={styles.label1Fone}>{date.fone}</Text>
        </TouchableOpacity>
        </View>
        <View>
        <Text style={styles.label1Text}>{date.hour}:{date.min}</Text>
        <Text style={styles.label1Text}>Percurso: {date.distance} km</Text>
        </View>

        <TouchableOpacity
          style={styles.routeWaze}
          onPress={()=>Linking.openURL(`geo:${date.latitudeDestino},${date.longitudeDestino}`)}>
          <Text style={styles.routeWazeText}>WAZE</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => changeStatus(date._id, 4, date.idUser)} style={styles.button} >
        <Text style={styles.buttonText}>Concluir viagem</Text>
      </TouchableOpacity>

    </View>
  )
}

function direction(){
  return (
    destination.latitude && origin.latitude ? 
    <Fragment>
    <MapViewDirections
      destination={destination}
      origin={origin}
      onReady={result =>{
        mapView.fitToCoordinates(result.coordinates, {
        edgePadding:{
          right: 30,
          left: 30,
          top: 150,
          bottom: 300
        }
      })}}
      apikey = {GOOGLE_API_KEY}
      strokeWidth={3}
      strokeColor='#222'
    />  
    <Marker
    coordinate={{
      latitude: parseFloat(destination.latitude),
      longitude: parseFloat(destination.longitude)
    }}
    anchor={{x:0, y:0}}
    >
    <Image
    style={{width: 15, height: 15}}
    source={require('../../assets/marker2.png')}
    />
    </Marker>
    </Fragment>
    :null
  )
}

return (
  <SafeAreaView style={{flex: 1}}>
    <View style={styles.container}>

      {!indicator && dateCall && state && showLabel === 0 ? labelCall(): null}
      {indicator ? <ActivityIndicator color="#72B76B" size="large" style={styles.indicator} /> : null}
      {indicator2 ? <ActivityIndicator color="#72B76B" size="large" style={styles.indicator2} /> : null}

      {showLabel === 1 ?
        label1()
      :showLabel === 2 ?
        label2()
      :showLabel === 3 ?
        label3()
      :null}

      <View style={styles.header}>
          <Icon name="menu" color="#424242" size={28} onPress={() => navigation.openDrawer()} />
          <View style={styles.labelHeader}>
            {state?<Text style={styles.statusOnText}>Você está ativo</Text>:<Text style={styles.statusOffText}>Você está inativo</Text>}
            <Switch
              style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
              value={state}
              onValueChange={()=>changeState()}
            />
          </View>
      </View>
      {position.latitude?
        <MapView
          style={styles.map}
            initialRegion={{
                longitude: parseFloat(position.longitude),
                latitude: parseFloat(position.latitude),
                longitudeDelta: 0.0200,
                latitudeDelta: 0.0100,
            }}
            loadingEnabled
            ref={el => (setMapView(el))}
            >

            <Marker
               coordinate={{ 
                 longitude: parseFloat(position.longitude),
                 latitude: parseFloat(position.latitude),}}
             >
             <Image
             style={{width: 20, height: 53}}
             source={require('../../assets/carro.png')}
           /></Marker>

            {showLabel === 1 ?
              direction()
            :showLabel === 3 ?
              direction()
            :null}
           
            </MapView>
            :<ActivityIndicator color="#424242" size="large" />}

        </View>
  </SafeAreaView>
)

}

