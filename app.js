import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Image, ScrollView, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [recipes, setRecipes] = useState([]);

  const fetchRecipes = async () => {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${search}&apiKey=05be1ab85feb409da9e024ca12f2fe32`
      );
      const data = await response.json();
      setRecipes(data.results || []);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Recipe Finder</Text>

      <View style={styles.searchWrapper}>
        <Ionicons name="search-outline" size={20} color="#999" />
        <TextInput
          style={styles.input}
          placeholder="Search for a dish..."
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity onPress={fetchRecipes} style={styles.miniButton}>
          <Text style={styles.buttonText}>Go</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Details', { recipeId: item.id })}
          >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Ionicons name="chevron-forward-outline" size={16} color="#CCC" />
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

function DetailsScreen({ route, navigation }) {
  const { recipeId } = route.params;
  const [details, setDetails] = useState(null);

  useEffect(() => {
    fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=05be1ab85feb409da9e024ca12f2fe32`)
      .then(res => res.json())
      .then(data => setDetails(data))
      .catch(err => console.error(err));
  }, [recipeId]);

  if (!details) return <View style={styles.center}><Text>Loading...</Text></View>;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: details.image }} style={styles.detailImage} />
      <View style={styles.contentPadding}>
        <Text style={styles.detailTitle}>{details.title}</Text>
        <Text style={styles.sectionHeader}>Instructions</Text>
        <Text style={styles.instructionText}>
          {details.instructions ? details.instructions.replace(/<[^>]*>?/gm, '') : "No instructions available."}
        </Text>
      </View>
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { elevation: 0, shadowOpacity: 0, borderBottomWidth: 0.5, borderBottomColor: '#EEE' },
          headerTitleStyle: { fontWeight: '300', color: '#333' }
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Recipe Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '300', color: '#333', paddingHorizontal: 20, paddingTop: 40, marginBottom: 20, letterSpacing: 1 },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#EEE',
    marginBottom: 20
  },
  input: { flex: 1, paddingVertical: 12, marginLeft: 10, color: '#333' },
  miniButton: { padding: 8 },
  buttonText: { color: '#55BCF6', fontWeight: '500' },
  card: { backgroundColor: '#FFF', marginHorizontal: 20, marginBottom: 15, borderRadius: 12, borderWidth: 0.5, borderColor: '#EEE', overflow: 'hidden' },
  cardImage: { width: '100%', height: 180 },
  cardInfo: { padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, color: '#444', fontWeight: '400', flex: 1 },
  detailImage: { width: '100%', height: 300 },
  contentPadding: { padding: 20 },
  detailTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  sectionHeader: { fontSize: 18, fontWeight: '500', color: '#555', marginTop: 10, marginBottom: 8 },
  instructionText: { fontSize: 15, color: '#666', lineHeight: 24 }
});
