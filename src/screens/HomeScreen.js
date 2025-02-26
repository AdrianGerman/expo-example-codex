import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ActivityIndicator,
  StyleSheet
} from "react-native"
import { generateImage } from "../api/replicate"

const HomeScreen = () => {
  const [prompt, setPrompt] = useState("")
  const [imageUrl, setImageUrl] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    const url = await generateImage(prompt)
    if (url) {
      setImageUrl(url)
    }
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generador de Imágenes IA</Text>
      <TextInput
        value={prompt}
        onChangeText={setPrompt}
        placeholder="Escribe tu prompt aquí..."
        style={styles.input}
      />
      <Button title="Generar Imagen" onPress={handleGenerate} />
      {loading && (
        <ActivityIndicator
          size="large"
          color="blue"
          style={{ marginTop: 10 }}
        />
      )}
      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f8f9fa"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },
  input: {
    width: "100%",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: "#ccc"
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 10
  }
})

export default HomeScreen
