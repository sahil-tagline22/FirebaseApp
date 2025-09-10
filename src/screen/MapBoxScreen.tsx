import { StyleSheet, View } from 'react-native'
import React from 'react'
import Mapbox, { Camera, FillLayer, LineLayer, MapView, PointAnnotation, ShapeSource } from '@rnmapbox/maps';
import Icon from 'react-native-vector-icons/MaterialIcons';

Mapbox.setAccessToken("pk.eyJ1Ijoia3Jpc2g5MDkxIiwiYSI6ImNtNjBmMHZ3MTBjd2kya3NlemVmcXZ5YnEifQ.exCZmPshie7BgkQ7hIming")

const MapBoxScreen = () => {

  const polygonCoordinates = [
    [72.857306, 21.253347], // 21.253347, 72.857306
    [72.859383, 21.253110], //21.253110, 72.859383
    [72.858835, 21.251730], //21.251730, 72.858835
    [72.857278, 21.251976], //21.251976, 72.857278
    // [72.857306, 21.253347], // back to start
  ];

  const loadAnnotationUK = (name:string,le:number,lo:number) => {
    return (
      <Mapbox.PointAnnotation
        key={name}
        id={name}
        coordinate={[le, lo]} //21.254437, 72.862736
      >
        <Icon name="location-on" color="#2796a0ff" size={30} />
        <Mapbox.Callout
          title={name}
          contentStyle={{ borderRadius: 5 }}
        />
      </Mapbox.PointAnnotation>
    );
  };

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
        <ShapeSource
        id="polygon"
        shape={{
          type:'Feature',
          geometry : {
            type : 'Polygon',
            coordinates : [polygonCoordinates]
          }
        }}
        >
          {/* <FillLayer
            id='polygonFill'
            style={{fillOutlineColor : 'red',}}
          /> */}
          <LineLayer
            id='polygonLine'
            style={{lineWidth : 4,lineColor : 'blue',lineCap : 'round',lineJoin : 'round'}}
          />
          
        </ShapeSource>
        <View>{loadAnnotationUK("Kosad",72.862736, 21.254437)}</View>
        <View>{loadAnnotationUK("Amroli", 72.851405,21.240877)}</View>
      </MapView>
    </View>
  );
}

export default MapBoxScreen

const styles = StyleSheet.create({
    page: {flex: 1},
  map: {flex: 1},
})