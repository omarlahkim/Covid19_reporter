import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    indicatorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    mapView: {
        flex: 1
    },
    selectBtnContainer: {
        position: 'absolute',
        bottom: 25,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 5,
        zIndex:0
    },
    selectBtn: {
        borderRadius: 50,
        backgroundColor: '#000000',
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor:'white',
        shadowColor:'black',
        shadowRadius:20,
        shadowOpacity:0.2,
        elevation:3,
        
    },
    fabLocation: {
        position: 'absolute',
        margin: 16,
        right: 0,
        top: 170,
        zIndex:0
      },
    selectBtnText: {
        color: '#ffffff'
    }
})

export default styles