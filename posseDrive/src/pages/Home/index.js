import React, { useState, useEffect, Fragment } from 'react'
import { Platform, Linking, Alert, View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import MapViewDirections from 'react-native-maps-directions'
import * as Location from 'expo-location'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-community/async-storage'
import {MaterialIcons as Icon} from '@expo/vector-icons'
import io from 'socket.io-client'
import api from '../../services/api'
import styles from './styles'
import { Notifications } from 'expo';

const API_URL = 'http://3.23.146.65:3000' 
const GOOGLE_API_KEY = 'chave google'


export default function Home() {

  const navigation = useNavigation()

  const [idDriver, setIdDriver] = useState()

  const [indicator, setIndicator] = useState(false)

  const [dadosMarker, setDadosMarker] = useState()

  const [date, setDate] = useState('')
  const [price, setPrice] = useState()

  const [state, setState] = useState(0)
  const [searchFocused, setSearchFocused] = useState(false)
  const [mapView, setMapView] = useState()

  const [position, setPosition] = useState({ latitude: "", longitude: "" })
  const [destination, setDestination] = useState({ latitude: "", longitude: "", title: "" })
  const [destinationRegion, setDestinationRegion] = useState({ latitude: "", longitude: "" })
  const [destinationDriver, setDestinationDriver] = useState({ latitude: "", longitude: "" })
  const [region, setRegion] = useState({ latitude: "", longitude: "" })
  const [origin, setOrigin] = useState()

  const [destinationAddress, setDestinationAddress] = useState()
  const [distance, setDistance] = useState()

  const [dateAsync, setDateAsync] = useState({id: "", name: "", fone: "",})


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
    Notifications.createChannelAndroidAsync('posse-drive', {
      name: 'posse drive',
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
        channelId: 'posse-drive',
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
  const id = await AsyncStorage.getItem('idUser@possedrive');

  const socket = io(API_URL, {
    query: {user: id},
  });
  socket.on('canal', date => {
    date.id === id && (date.msg === 'no-driver'  
    || date.msg ===  'aceito' 
    || date.msg === 'com-user' 
    || date.msg === 'cancelar' 
    || date.msg === 'concluido') ?
    getDate()
    :null

    date.id === id && date.msg === 'chegou-user' ?
        (getDate(),
        not('Seu motorista chegou')) 
    :null
    })

    socket.on('refresh', date => {
      showMarkerDriver()
})

}
useEffect(() => {
  socket()
}, []);
//Conexão de socket.io --------------------------------------------------------------------------------


// mostrar makers dos motoristas conectados
async function showMarkerDriver(){
  const response = await api.get('marker/get')
  if(response.data){
  setDadosMarker(response.data[0].date)
  getDate()
  }
}

  async function getDadosStorage(){
    const id = await AsyncStorage.getItem('idUser@possedrive')
    const name = await AsyncStorage.getItem('nameUser@possedrive')
    const fone = await AsyncStorage.getItem('foneUser@possedrive')
    setDateAsync({id: id, name: name, fone: fone,})
  }
  useEffect(()=>{getDadosStorage()},[])


  async function getDate(){
    const id = await AsyncStorage.getItem('idUser@possedrive')
    const responsePrice = await api.get('price/get')
    const response = await api.get(`call/getIdUser?idUser=${id}`)
    const dados = response.data
    setDate(dados)
    setPrice(responsePrice.data[0].valor)

      if(dados[0].idDriver){
        setIdDriver(dados[0].idDriver)
      }

    dados.map(date => (
      date.status === "CANCELADO-DRIVER" ?
         concluiCall(date._id, date.idDriver, "O motorista cancelou a viagem, solicite novamente!")
      :date.status === "NO-DRIVER" ?
         concluiCall(date._id, date.idDriver, "Não há motoristas disponíveis no momento, solicite novamente em alguns minutos!")
      :date.status === "CONCLUIDO" ?
        concluiCall(date._id, date.idDriver, `Viagem concluída: Valor R$ ${Number(response.data[0].valor).toFixed(2).replace(".", ",")}. obrigado por utilizar nossos serviços!`)
      :date.status === "AGUARDANDO" 
      ? setState(4) 
      :date.status === "CHEGOU-USER"
      ? setState(6) 
      :date.status === "COM-USER"
      ? setState(7) 
      :date.status ===  "ACEITO"
    ? driverAcept( dados[0].latDriver, dados[0].lgtDriver )
      : null
    ))
  }
  useEffect(() => {getDate()}, [])


async function driverAcept(lat, lgt){
  setDestinationDriver({
    latitude: lat,
    longitude: lgt
  })
  setState(5)
}


  async function concluiCall(id, idDriver, msg){
    const newId = `concluido-${id}`
    const newIdDriver = `concluido-${idDriver}`

    await api.put(`call/updateIdDriver/${id}`, { idDriver: newIdDriver })
    const response = await api.put(`/call/updateIdUser/${id}`, {
      idUser: newId
    })

    const { success, error } = response.data

    if(success){
    setSearchFocused(false)
    setState(0)
    setDestinationAddress(null)
    setDestination({
      latitude: null,
      longitude: null,
      title: null,
     })
     setDestinationDriver({
      latitude: null,
      longitude: null,
      title: null,
     })
     alert(msg)
    }
  }

  async function call(){
    setIndicator(true)

      let latitudeOrigin = ""
      let longitudeOrigin = ""
  
      if(region.latitude){
       latitudeOrigin = region.latitude
       longitudeOrigin = region.longitude
      }else{
       latitudeOrigin = position.latitude
       longitudeOrigin = position.longitude
      }
  
      valor = (distance + price)

    //obtem hora e minuto
     let hour = new Date().getHours()
     let min = new Date().getMinutes()
     let sec = new Date().getSeconds()
  
     await api.post('call/create', {   
        idUser: dateAsync.id,
        name: dateAsync.name,
        fone: dateAsync.fone,
        latitude: latitudeOrigin,
        longitude: longitudeOrigin,
        hour,
        min,
        sec,
        status: "AGUARDANDO",
        valor,
        distance: distance,
        enderecoDestino: destinationAddress,
        latitudeDestino: destination.latitude,
        longitudeDestino: destination.longitude,
        titleDestino: destination.title,
       })

       setState(4)
       getDate()
       setIndicator(false)
  }

  function cancelar(id, idDriver){
    Alert.alert(
      'Deseja realmente cancelar?',
      'Excesso de cancelamentos podem levar ao bloqueio do aplicativo!',
      [
        {text: 'NÃO', onPress: () => console.warn('Solicitação Cancelada'), style: 'cancel'},
        {text: 'SIM', onPress: () =>  cancelarConfirm(id, idDriver)},
      ]
    )
    }
  
    async function cancelarConfirm(id, idDriver){
        setIndicator(true)
        
        if(idDriver){
        const newIdDriver = `cancelado-${idDriver}`
        await api.put(`call/updateIdDriver/${id}`, { idDriver: newIdDriver })
        }

        const response = await api.put(`call/updateStatus/${id}`, {
          status: 'CANCELADO-USER'
        })
        
        const { success, error } = response.data

        if(success){
        setSearchFocused(false)
        setState(0)
        setDestinationAddress(null)
        setDestination({
          latitude: null,
          longitude: null,
          title: null,
         })
         setDestinationDriver({
          latitude: null,
          longitude: null,
          title: null,
         })
         await api.get(`canal/all-drivers/cancelar`)
        }
        else if(error){
          alert('Opss, ocorreu um erro, tente cancelar novamente!')
        }
        setIndicator(false)
    }

  function confirmDefine() {
    if (destinationRegion) {
      setDestination({
        longitude: parseFloat(destinationRegion.longitude),
        latitude: parseFloat(destinationRegion.latitude),
      })
      setOrigin({
        longitude: parseFloat(position.longitude),
        latitude: parseFloat(position.latitude),
      })
      setState(2)
    }
  }

  function defineLocationButton() {
    return (
      <Fragment>
        <TouchableOpacity
          style={styles.defineLocation}
          onPress={() => setState(1)}>
          <Icon name="gps-fixed" color="#424242" size={18} />
          <Text style={styles.defineLocationText}>Definir meu destino no mapa</Text>
        </TouchableOpacity>
      </Fragment>
    )
  }

  function defineLocation() {
    return (
      <Fragment>
        <View style={styles.marker}>
          <Image
            style={{ height: 35, width: 20 }}
            source={require('../../assets/marker.png')} />
        </View>

        <TouchableOpacity
          style={styles.back}
          onPress={() => setState(0)}>
          <Icon name="chevron-left" color="#424242" size={40} />
        </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonDefine}
            onPress={() => confirmDefine()}>
            <Text style={styles.buttonDefineText}>Pronto</Text>
          </TouchableOpacity>

      </Fragment>
    )
  }

  function directions1() {
    return (
      <Fragment>
        <MapViewDirections
          destination={destination}
          origin={origin}
          onReady={result => {
            setDistance(Math.round(result.distance))

            mapView.fitToCoordinates(result.coordinates, {
              edgePadding: { right: 30, left: 30, top: 100, bottom: 400 }
            })
          }}
          apikey = {GOOGLE_API_KEY}
          strokeWidth={3}
          strokeColor='#222' />

        <Marker
          coordinate={{
            latitude: parseFloat(destination.latitude),
            longitude: parseFloat(destination.longitude)
          }}
          anchor={{ x: 0, y: 0 }}>
          <Image
            style={{ width: 15, height: 15 }}
            source={require('../../assets/marker2.png')}
          />{destination.title ? <Text style={styles.titleDestination}>{destination.title}</Text> : null}
        </Marker>
      </Fragment>
    )
  }

  function directions2() {
    return (
      <MapViewDirections
        destination={origin}
        origin={origin}
        onReady={result => {
          mapView.fitToCoordinates(result.coordinates, {
            edgePadding: {
              right: 0,
              left: 0,
              top: 0,
              bottom: 0
            }
          })
        }}
        apikey = {GOOGLE_API_KEY}
      />
    )
  }

  function directions3() {
    return (
      <Fragment>
        <MapViewDirections
          destination={destinationDriver}
          origin={origin}
          onReady={result => {
            mapView.fitToCoordinates(result.coordinates, {
              edgePadding: {
                right: 100,
                left: 100,
                top: 200,
                bottom: 400
              }
            })
          }}
          apikey = {GOOGLE_API_KEY}
          strokeWidth={3}
          strokeColor='#222'
        />
      </Fragment>
    )
  }

  function directions4() {
    return (
      <Fragment>

        <MapViewDirections
          destination={destination}
          origin={origin}
          onReady={result => {
            mapView.fitToCoordinates(result.coordinates, {
              edgePadding: { right: 30, left: 30, top: 100, bottom: 400 }
            })
          }}
          apikey = {GOOGLE_API_KEY}
          strokeWidth={3}
          strokeColor='#222' />


        <Marker
          coordinate={{
            latitude: parseFloat(destination.latitude),
            longitude: parseFloat(destination.longitude)
          }}
          anchor={{ x: 0, y: 0 }}>
          <Image
            style={{ width: 15, height: 15 }}
            source={require('../../assets/marker2.png')}
          />{destination.title ? <Text style={styles.titleDestination}>{destination.title}</Text> : null}
        </Marker>
      </Fragment>
    )
  }

  function autocomplete() {
    return (
      <GooglePlacesAutocomplete
        placeholder="Para onde?"
        placeholderTextColor="#333"
        onPress={(data, details) => {
          setDestinationAddress(data.description)
          setState(2)
          const { location: { lat: latitude, lng: longitude } } = details.geometry
          setDestination({
            latitude: latitude,
            longitude: longitude,
            title: data.structured_formatting.main_text,
          })
          setOrigin({
            longitude: parseFloat(position.longitude),
            latitude: parseFloat(position.latitude),
          })

        }}
        query={{
          key: GOOGLE_API_KEY,
          language: 'pt',
          components: "country:BR",
          strictBounds: true,
          location: "-14.0943347, -46.3674341",
          radius: "50000",
        }}
        debounce={800}
        //predefinedPlaces={}
        textInputProps={{
          onFocus: () => { setSearchFocused(true) },
          onBlur: () => { setSearchFocused(false) },
          autoCapitalize: "none",
          autoCorrect: false
        }}
        listViewDisplayed={searchFocused}
        fetchDetails
        enablePoweredByContainer={false}
        styles={{
          container: {
            zIndex: 2,
            position: 'absolute',
            top: 35,
            right: 15,
            width: '80%',
          },
          textInputContainer: {
            flex: 1,
            height: 40,
            borderTopWidth: 0,
            borderBottomWidth: 0,
          },
          textInput: {
            height: 40,
            margin: 0,
            borderRadius: 0,
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 5,
            paddingRight: 5,
            marginTop: 0,
            marginLeft: 0,
            marginRight: 0,
            elevation: 2,
            fontSize: 14,
          },
          listView: {
            elevation: 2,
            marginTop: 45,
            boderWidth: 1,
            borderColor: '#ddd',
            backgroundColor: '#fff',
          },
          description: {
            fontSize: 10,
          },
          row: {},
        }}
      />
    )
  }

  function label1(){
    return(
      <Fragment>
        <TouchableOpacity
          style={styles.back}
          onPress={() => setState(0)}>
          <Icon name="chevron-left" color="#424242" size={40} />
        </TouchableOpacity>
  
      <View style={styles.label}>
          <View style={styles.dateCar}>
          <View style={styles.dateCar2}>
            <Image
            style={styles.imageCar}
            source={require('../../assets/iconeCar.png')}
            />
            <View>
              <Text style={styles.driverTypeText}>Driver-X</Text>
              <Text style={styles.capacityCarText}>4 Passageiros</Text>
            </View>
            </View>
            {distance && price ? <Text style={styles.priceText}>R$ {(distance+price).toFixed(2).replace(".", ",")}</Text>
            :<ActivityIndicator color="#f5f5f5" size={10} />}
          </View>

          <View  style={styles.labelButton}>
            <TouchableOpacity
              style={styles.button}
              onPress={()=>setState(3)}>
              <Text style={styles.buttonText}>Chamar motorista</Text>
            </TouchableOpacity>
        </View>

      </View>
      </Fragment>
    )
  }

  function label2(){
    return(
      <Fragment>
          <TouchableOpacity
          style={styles.back}
          onPress={() => setState(0)}>
          <Icon name="chevron-left" color="#424242" size={40} />
        </TouchableOpacity>
  
          <View style={styles.marker}>  
          <Image 
            style={{height: 35, width:20}}
            source={require('../../assets/marker.png')} />
        </View> 
  
      <View style={styles.label}>
          <Text style={styles.originText}>Defina seu local de partida</Text>

         <View  style={styles.labelButton}>
          <TouchableOpacity
            style={styles.button}
            onPress={()=>call()}>
            <Text style={styles.buttonText}>Confirmar partida</Text>
          </TouchableOpacity>
        </View>
      </View>

      </Fragment>
    )
  }

  function label3(){
    return(
      <Fragment>
        {date ?  
        date.map(date=>(
          date.status === "AGUARDANDO" ?
            <Fragment>
              <View style={styles.label}>
                <Text style={styles.searchText}>Buscando motorista mais próximo</Text>
                <ActivityIndicator color="#72B76B" size={30} />
              
              <View style={styles.labelButton}>
              <TouchableOpacity
                style={styles.button}
                onPress={()=>cancelar(date._id, date.idDriver)}>
                <Text style={styles.buttonTextCancel}>Cancelar viagem</Text>
              </TouchableOpacity>
              </View>
              </View>
            </Fragment>

          :date.status === "ACEITO" ?
            <Fragment>
            <View style={styles.label}>
              <Text style={styles.searchText}>Motorista à caminho, Aguarde!</Text>

              <View style={styles.labelDateDriver}>
                <View style={styles.labelDateDriver2}>
                  <Text style={styles.dateDriverText}>{date.nameDriver}</Text>
                  <Text style={styles.dateDriverText}>{date.notaDriver.toFixed(1)} &#9733;</Text>
                </View>
                <View style={styles.labelDateCarDriver}>
                  <Text style={styles.dateDriverText}>{date.carro}</Text>
                  <Text style={styles.dateDriverText}>{date.placa}</Text>
                </View>
              </View>

              <View style={styles.labelButton}>
              <TouchableOpacity
                style={styles.button}
                onPress={()=>cancelar(date._id, date.idDriver)}>
                <Text style={styles.buttonTextCancel}>Cancelar viagem</Text>
              </TouchableOpacity>
              </View>

            </View>
          </Fragment>


          :date.status === "CHEGOU-USER" ?
            <Fragment>
            <View style={styles.label}>
              <Text style={styles.arriveText}>Seu motorista chegou!</Text>

              <View style={styles.labelDateDriver}>
                <View style={styles.labelDateDriver2}>
                  <Text style={styles.dateDriverText}>{date.nameDriver}</Text>
                  <Text style={styles.dateDriverText}>{date.notaDriver}&#9733;</Text>
                </View>
                <View style={styles.labelDateCarDriver}>
                  <Text style={styles.dateDriverText}>{date.carro}</Text>
                  <Text style={styles.dateDriverText}>{date.placa}</Text>
                </View>
              </View>

              <View style={styles.labelButton}>
              <TouchableOpacity
                style={styles.button}
                onPress={()=>cancelar(date._id, date.idDriver)}>
                <Text style={styles.buttonTextCancel}>Cancelar viagem</Text>
              </TouchableOpacity>
              </View>

            </View>
          </Fragment>

          :date.status === "COM-USER" ?

          <Fragment>
          <View style={styles.label}>
            <Text style={styles.searchText}>Boa Viagem</Text>

            <View style={styles.labelDateDriver}>
              <View style={styles.labelDateDriver2}>
                <Text style={styles.dateDriverText}>{date.nameDriver}</Text>
                <Text style={styles.dateDriverText}>{date.notaDriver}&#9733;</Text>
              </View>
              <View style={styles.labelDateCarDriver}>
                <Text style={styles.dateDriverText}>{date.carro}</Text>
                <Text style={styles.dateDriverText}>{date.placa}</Text>
              </View>
            </View>

            <View style={styles.labelButton}>
              <TouchableOpacity
                style={styles.button}
                onPress={()=>Linking.openURL(`geo:${date.latitudeDestino},${date.longitudeDestino}`)}>
                <Text style={styles.routeText}>Acompanhar meu trajeto</Text>
              </TouchableOpacity>
            </View>

          </View>
        </Fragment>
          :null


       ))
    :null}
    </Fragment>
    )}

  return (
    <View style={styles.container}>

    {indicator ? <ActivityIndicator color="#72B76B" size="large" style={styles.indicator} /> : null}

      {state === 0 || state === 4 ?
      <Icon name="menu" color="#424242" size={28} onPress={() => navigation.openDrawer()} style={styles.menu} />
      :null}
      
      {state === 0 ?
      <>
      {autocomplete()}
      {searchFocused ? defineLocationButton() : null}
      </>
      :state === 1 ? defineLocation()
      :state === 2 ? label1()
      :state === 3 ? label2()
      :state === 4 || 5 || 6 || 7 ? label3()
      :null}
 

      {position.latitude ?
        <MapView
          style={styles.map}
          initialRegion={{
            longitude: parseFloat(position.longitude),
            latitude: parseFloat(position.latitude),
            longitudeDelta: 0.0100,
            latitudeDelta: 0.0050,
          }}
          onRegionChange={(region)=>state==3?setRegion(region):setDestinationRegion(region)}
          showsUserLocation
          loadingEnabled
          ref={el => (setMapView(el))}
        >
          {state === 2 && destination.latitude ? directions1()
          :state === 3 && origin.latitude ? directions2()
          :state === 5 && destinationDriver.latitude ? directions3()
          :state === 7 && destination.latitude ? directions4()
          :null}

            {dadosMarker && state === 0?
                dadosMarker.map(date=>(
                <Marker key={date.id}
                  coordinate={{ 
                    longitude: Number(date.lgt),
                    latitude: Number(date.lat),
                    }}
                    title={date.name}>
                <Image
                style={{width: 20, height: 36}}
                source={require('../../assets/carro.png')}/>
              </Marker>
              ))
              :null}

              {dadosMarker && state === 5 && idDriver?
                dadosMarker.map(date=>(
                date.id === idDriver ?
                <Marker key={date.id}
                  coordinate={{ 
                    longitude: Number(date.lgt),
                    latitude: Number(date.lat),
                    }}
                    title={date.name}>
                <Image
                style={{width: 20, height: 36}}
                source={require('../../assets/carro.png')}/>
              </Marker>
              :null
              ))
              :null}    

        </MapView> 
        :<ActivityIndicator size="large" color="#424242" /> 
      }

    </View>
  )
}

