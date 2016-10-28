import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  graphContainer: {
    backgroundColor: '#66ccff',
    width: 800,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headDiagram: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },

  textbox: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalInnerContainer: {
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },

  modal: {
    flex: .25,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  title: {
    flex: 1,
    color:'#004080',
    fontWeight: 'bold',
    fontSize: 30,
      },

  header: {
    flex: 1,
    fontSize: 25,
    margin: 20,
  },

  body: {
    flex: 1,
    fontSize: 18,
    margin: 20,
  }, 

  picker: {
    width: 150,
    color: '#383838', 
  },

  connector: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#99ccff',
    width: 800,
    borderWidth: 1,
    alignItems: 'center',
  },

  titlebox: {
    flex: 1,
  },
});