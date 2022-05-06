import { Button, Card, Text } from "@rneui/themed"
import React from "react"
import { StyleSheet } from "react-native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import Deck from "./src/Deck"

const DATA = [
  { id: 1, text: "Card #1", uri: "https://images.unsplash.com/photo-1536329583941-14287ec6fc4e" },
  { id: 2, text: "Card #2", uri: "http://www.fluxdigital.co/wp-content/uploads/2015/04/Unsplash.jpg" },
  { id: 3, text: "Card #3", uri: "http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-09.jpg" },
  { id: 4, text: "Card #4", uri: "http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-01.jpg" },
  { id: 5, text: "Card #5", uri: "http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-04.jpg" },
  { id: 6, text: "Card #6", uri: "http://www.fluxdigital.co/wp-content/uploads/2015/04/Unsplash.jpg" },
  { id: 7, text: "Card #7", uri: "http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-09.jpg" },
  { id: 8, text: "Card #8", uri: "http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-01.jpg" },
]


export default function App() {
  const renderCard = (item: { id: number, text: string, uri: string }) => {
    return (
      <Card key={item.id}>
        <Card.Title>{item.text}</Card.Title>
        <Card.Image source={{ uri: item.uri }} />
        <Text style={{ marginBottom: 10 }}>
          I can customize the card further
        </Text>
        <Button
          icon={{ name: "code" }}
          style={{ backgroundColor: "#03A9F4" }}
          title="View now"
        />
      </Card>
    )
  }

  const renderNoMoreCards = () => { 
    return (
      <Card>
        <Card.Title>All Done!</Card.Title>
        <Text style={{marginBottom: 10}}>
          There&apos;s no more content here!
        </Text>
        <Button
          icon={{ name: "code" }}
          style={{ backgroundColor: "#03A9F4" }}
          title="Get more"
        />
      </Card>
    )
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Deck
          data={DATA}
          renderCard={renderCard}
          renderNoMoreCards={renderNoMoreCards}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
})
