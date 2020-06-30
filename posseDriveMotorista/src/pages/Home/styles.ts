import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  map: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  header: {
    zIndex: 1,
    position: 'absolute',
    width: '100%',
    height: 70,
    top: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    backgroundColor: '#e1e1e1',
    paddingBottom: 10,
  },

  labelHeader:{
    width: '55%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  statusOnText: {
    color: '#72B76B',
  },

  statusOffText: {
    color: '#DC143C',
  },


  sectionCall: {
    zIndex: 2,
    position: 'absolute',
    top: 70,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(42,42,42,0.5)',
  },

  labelCall:{
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    backgroundColor: '#72B76B',
    borderRadius: 10,
    marginBottom: 70,
  },

  labelButtonCall:{
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },

  buttonCall: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  titleCall:{
    fontSize: 18,
    color: '#f5f5f5',
    paddingTop: 10,
    fontWeight: 'bold',
  },

  distanceCall:{
    width: '80%',
    textAlign: 'center',
    color: '#424242',
  },

  buttonCallText:{
    color: '#72B76B',
    fontSize: 14,
    fontWeight: 'bold',
  },

  progress:{
    position: 'absolute',
  },

  section1: {
    zIndex: 1,
    position: 'absolute',
    width: '100%',
    height: 170,
    bottom: 0,
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },

  label1Text: {
    color: '#c1c1c1',
  },

  label1: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  button: {
    width: '70%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#424242',
    fontWeight: 'bold',
  },

  label1Fone:{
    color: '#72B76B',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },

  routeWaze:{
    backgroundColor: '#72B76B',
    width: 50,
    padding: 2,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  routeWazeText:{
    color: '#424242',
  },

  titleAdviser:{
    color: '#72B76B',
    fontSize: 16,
    fontWeight: 'bold',
  },

  indicator:{
    zIndex: 2,
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(42,42,42,0.7)'
  },

  indicator2:{
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

  buttonLabel:{
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  button2:{
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'tomato'
  },

  buttonText2:{
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  }
})

export default styles
