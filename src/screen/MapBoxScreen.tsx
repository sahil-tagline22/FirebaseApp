import { StyleSheet, View } from 'react-native'
import React from 'react'
import Mapbox, { Camera, MapView, PointAnnotation } from '@rnmapbox/maps';

Mapbox.setAccessToken("pk.eyJ1Ijoia3Jpc2g5MDkxIiwiYSI6ImNtNjBmMHZ3MTBjd2kya3NlemVmcXZ5YnEifQ.exCZmPshie7BgkQ7hIming")

const MapBoxScreen = () => {
  return (
    <View style={styles.page}>
      <MapView style={styles.map}>
        <Camera
          zoomLevel={12}
          centerCoordinate={[72.858755, 21.255387]} // [lng, lat] → Bangalore. 21.255387, 72.858755
        />
        <PointAnnotation
          id="marker1"
          coordinate={[72.858755, 21.255387]}
        />
      </MapView>
    </View>
  );
}

export default MapBoxScreen

const styles = StyleSheet.create({
    page: {flex: 1},
  map: {flex: 1},
})