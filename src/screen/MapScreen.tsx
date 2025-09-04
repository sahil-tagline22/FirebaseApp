import { StyleSheet, View } from 'react-native'
import React from 'react'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'

const MapScreen = () => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.container}
        provider={PROVIDER_GOOGLE}
        region={{
            latitude : 37.78825,
            longitude : -122.4324,
            latitudeDelta : 0.0922,
            longitudeDelta : 0.0421,
        }}
      >

      </MapView>
    </View>
  )
}

export default MapScreen

const styles = StyleSheet.create({
    container : {
        flex:1
    }
})