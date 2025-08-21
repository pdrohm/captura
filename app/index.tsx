import { Redirect } from 'expo-router';

export default function RootIndex() {
  // Redirect to the map tab by default (territory tab in DogEatDog)
  return <Redirect href="/(main)/map" />;
}
