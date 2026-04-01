import { Link, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, FlatList, Pressable } from 'react-native';
import { api } from '../../src/api/tmdb';

interface MovieDetails {
  title: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  runtime: number;
}

export interface CastDetails{

  id:string;
  name:string;
  character:string;
  profile_path:string;
}

export default function MovieDetailsScreen() {
  // Captura o parâmetro '[id]' do nome do arquivo
  const { id } = useLocalSearchParams();
  const [actor, setActor] = useState<MovieDetails | null>(null);
  const [movies, setMovies] = useState<CastDetails[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  console.log("TAMANHO TOTAL DO ELENCO: ", movies!.length);
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const actorDetails = await api.get(`/person/${id}`);
        setActor(actorDetails.data);

        const actorMovieDetails = await api.get(`/person/${id}/movi`);

        console.log("Filmes do ator", actorMovieDetails.data)

        setMovies(actorMovieDetails.data['cast']);

      } catch (error) {
        console.error('Erro ao buscar detalhes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]); // O hook é re-executado caso o ID mude

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (!actor) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Filme não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {actor.poster_path && (
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${actor.poster_path}`,
          }}
          style={styles.poster}
          resizeMode="cover"
        />
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{actor.title}</Text>

        <View style={styles.statsContainer}>
          <Text style={styles.statText}>
            ⭐ {actor.vote_average.toFixed(1)}/10
          </Text>
          <Text style={styles.statText}>⏱️ {actor.runtime} min</Text>
        </View>

        <Text style={styles.sectionTitle}>Sinopse</Text>
        <Text style={styles.overview}>
          {actor.overview || "Sinopse não disponível para este filme."}
        </Text>

        <Text style={styles.sectionTitle}>Elenco</Text>
        {/* <FlatList
          data={cast}
          horizontal={true}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (

            <Link href={'/'} asChild>            
              <Pressable>
                <CastCard {...item}></CastCard>
              </Pressable>
            </Link>
          )}
        /> */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  poster: { width: '100%', height: 400 },
  content: { padding: 20 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  statsContainer: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  statText: { color: '#E50914', fontSize: 16, fontWeight: '600' },
  sectionTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 8, marginTop:10 },
  overview: { color: '#D1D5DB', fontSize: 16, lineHeight: 24 },
  errorText: { color: '#FFFFFF', fontSize: 18 },

});
