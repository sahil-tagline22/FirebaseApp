import { StyleSheet, View } from 'react-native'
import React from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'

const MapScreen = () => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.container}
        provider={PROVIDER_GOOGLE}
        region={{
            latitude : 21.16993143181012, 
            longitude : 72.82031991015907,
            latitudeDelta : 0.0922,
            longitudeDelta : 0.0421,
        }}
      >
        <Marker
        coordinate={{
          latitude : 21.255400, 
          longitude :72.858739
        }}
        title='Location'
        description='graham circle'
        />

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