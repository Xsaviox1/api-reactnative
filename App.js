import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const MovieInfo = ({ movieData }) => {
  return (
    <View style={{ marginHorizontal: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{movieData.Title}</Text>
      <Text>Ano: {movieData.Year}</Text>
      <Text>Gênero: {movieData.Genre}</Text>
      <Text>Diretor: {movieData.Director}</Text>
      <Text>Prêmios: {movieData.Awards}</Text>
      {movieData.Poster !== 'N/A' ? (
        <Image
          source={{ uri: movieData.Poster }}
          style={{ width: 150, height: 250, marginTop: 10, alignSelf: 'center' }}
          resizeMode="contain"
        />
      ) : (
        <Text>Capa não disponível</Text>
      )}
    </View>
  );
};

const App = () => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movieData, setMovieData] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão de localização não concedida',
          'Por favor, conceda permissão de localização para obter a localização.'
        );
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
    };

    getLocation();
  }, []);

  const handleSearch = async () => {
    if (movieTitle.trim() === '') {
      Alert.alert('Aviso', 'Por favor, insira um título de filme válido.');
      return;
    }
    try {
      const apiKey = '1993e977'; // Substitua pelo seu próprio API Key
      const apiUrl = `https://www.omdbapi.com/?t=${movieTitle}&apikey=${apiKey}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.Response === 'True') {
        setMovieData(data);
      } else {
        Alert.alert('Erro', 'Filme não encontrado. Verifique o título e tente novamente.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Houve um problema na busca do filme. Tente novamente mais tarde.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscador de Filmes</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do filme"
        value={movieTitle}
        onChangeText={(text) => setMovieTitle(text)}
      />
      <View style={styles.buttonContainer}>
        <Button title="Buscar Filme" onPress={handleSearch} />
      </View>

      {movieData && <MovieInfo movieData={movieData} />}

      {location && (
        <View style={styles.mapContainer}>
          <Text style={styles.mapTitle}>Sua Localização atual</Text>

          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Sua Localização"
            />
          </MapView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop:8
  },
  input: {
    borderWidth: 1,
    marginVertical: 10,
    padding: 8,
    borderRadius: 12,
    width: '100%',
  },
  buttonContainer: {
    width: '50%',
    marginBottom: 20,
  },
  mapContainer: {
    marginTop: 'auto',
    width: '100%',
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 10,
  },
  map: {
    width: '100%',
    height: 200,
  },
});

export default App;
