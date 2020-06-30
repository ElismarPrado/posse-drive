import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  map: {
    zIndex: 0,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  menu: {
    zIndex: 1,
    position: 'absolute',
    left: 15,
    top: 40,
  },

  defineLocation: {
    zIndex: 1,
    width: '80%',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: "#fff",
    position: 'absolute',
    top: 77,
    right: 15,
    borderColor: '#c1c1c1',
    borderWidth: 0.5,
  },

  defineLocationText:{
    fontSize: 11,
    paddingLeft: 10,
  },

  buttonDefine: {
    position: 'absolute',
    bottom: 20,
    zIndex: 1,
    alignItems: 'center',
    width: '70%',
    borderRadius: 10,
    backgroundColor: '#000',
    padding: 12,
  },

  buttonDefineText: {
    color: '#f5f5f5',
    fontWeight: 'bold',
  },

  marker: {
    zIndex: 1,
    marginLeft: -10,
    marginTop: -35,
    width: 20,
    height: 35,
    position: 'absolute',
    left: '50%',
    top: '50%',
  },

  back: {
    zIndex: 1,
    position: 'absolute',
    top: 25,
    left: 10,
    padding: 5,
  },

  label:{
    zIndex: 1,
    position: 'absolute',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 170,
    bottom: 0,
    width: '100%',
    backgroundColor: '#000',
    paddingVertical: 15,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },

  dateCar:{
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  dateCar2:{
    flexDirection: 'row',
    alignItems: 'center',
  },

  imageCar:{
    marginRight: 15,
    width: 70,
    height: 70,
  },

  driverTypeText:{
    color: '#f5f5f5'
  },

  capacityCarText:{
    color: '#f5f5f5',
    fontSize: 12,
  },

  priceText:{
    color: '#f5f5f5',
    fontSize: 16,
  },

  labelButton:{
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  button: {
    width: '70%',
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },

  buttonText:{
    color: '#424242',
    fontWeight: 'bold',
  },

  originText:{
    width: '100%',
    fontSize: 16,
    textAlign: 'center',
    color: '#f5f5f5',
    fontWeight: 'bold',
  },

  searchText:{
    width: '100%',
    fontSize: 16,
    textAlign: 'center',
    color: '#f5f5f5',
    fontWeight: 'bold',
  },

  buttonTextCancel:{
    color: 'red',
    fontWeight: 'bold',
  },

  labelDateDriver:{
    width: '90%',
    height: 50,
    paddingVertical: 5,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 0.5,
    borderColor: '#424242',
    borderRadius: 10,
  },

  dateDriverText:{
    color: '#f5f5f5',
  },

  arriveText:{
    width: '100%',
    fontSize: 16,
    textAlign: 'center',
    color: '#72B76B',
    fontWeight: 'bold',
  },

  routeText:{
    color: '#72B76B',
    fontWeight: 'bold',
  },

  indicator:{
    zIndex: 2,
    position: 'absolute',
    width: '100%',
    height: 170,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'rgba(42,42,42,0.7)'
  },

})

export default styles
