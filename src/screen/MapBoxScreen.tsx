import { StyleSheet, View } from 'react-native'
import React from 'react'
import Mapbox, { Callout, Camera, LineLayer, MapView, PointAnnotation, ShapeSource } from '@rnmapbox/maps';
import Icon from 'react-native-vector-icons/MaterialIcons';

Mapbox.setAccessToken("pk.eyJ1Ijoia3Jpc2g5MDkxIiwiYSI6ImNtNjBmMHZ3MTBjd2kya3NlemVmcXZ5YnEifQ.exCZmPshie7BgkQ7hIming")

const MapBoxScreen = () => {

  //MapBox polygon direction
  const polygonCoordinates = [
    [72.857306, 21.253347], // 21.253347, 72.857306
    [72.859383, 21.253110], //21.253110, 72.859383
    [72.858835, 21.251730], //21.251730, 72.858835
    [72.857278, 21.251976], //21.251976, 72.857278
    [72.857306, 21.253347], // back to start
  ];

  //MapBox line direction
  const lineCoordinates = [
    [72.858755, 21.255387], // 21.253347, 72.857306
    [72.859660, 21.261245], //21.253110, 72.859383
  ];
 
  //multiple marker display
  const markers = [
    { id: 'kosad', title: 'Kosad gam', coord: [72.862736, 21.254437] },
    { id: 'amroli', title: 'Amroli', coord: [72.851405, 21.240877] },
  ];

  return (
    <View style={styles.page}>
      <MapView style={styles.map}>

        <Camera
          zoomLevel={14}
          centerCoordinate={[72.858755, 21.255387]} // [lng, lat] → 21.255387, 72.858755
        />

        <PointAnnotation
         key='marker1'
         id="marker1"
         coordinate={[72.858755, 21.255387]}
        >
          <Callout title={'Gruham circle'} contentStyle={styles.PointAnnotation}/>
        </PointAnnotation>

        <PointAnnotation
         key='marker2'
         id="marker2"
         coordinate={[72.859660, 21.261245]}
        >
          <Callout title={'Gruham circle'} contentStyle={styles.PointAnnotation}/>
        </PointAnnotation>

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
          <LineLayer
            id='polygonLine'
            style={styles.polygonLineStyle}
          />
        </ShapeSource>

        <ShapeSource
          id="line"
          shape={{
            type:'Feature',
            geometry : {
              type : 'LineString',
              coordinates : lineCoordinates
            }
          }}
        >
          <LineLayer
            id='lineDraw'
            style={styles.lineStyle}
          />
        </ShapeSource>

        {markers.map(item=>(
          <PointAnnotation
            key={item.id}
            id={item.id}
            coordinate={item.coord} //21.254437, 72.862736
          >
            <Icon name="location-on" color="#2796a0ff" size={30} />
            <Callout
              title={item.title}
              contentStyle={styles.PointAnnotation}
            />
          </PointAnnotation>
        ))}

      </MapView>
    </View>
  );
}

export default MapBoxScreen

const styles = StyleSheet.create({
  page: {flex: 1},
  map: {flex: 1},
  polygonLineStyle:{
    lineWidth : 4,
    lineColor : 'blue',
    lineCap : 'round',
    lineJoin : 'round'
  },
  PointAnnotation:{
    borderRadius: 5
  },
  lineStyle:{
    lineWidth : 2,
    lineColor : 'blue',
    lineCap : 'round',
    lineJoin : 'round'
  }
})