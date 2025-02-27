import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert
} from "react-native"
import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"
import * as MediaLibrary from "expo-media-library"

import { generateImage } from "../api/replicate"

const HomeScreen = () => {
  const [prompt, setPrompt] = useState("")
  const [imageUrl, setImageUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions()

  useEffect(() => {
    if (!permissionResponse) {
      requestPermission()
    }
  }, [])

  const handleGenerate = async () => {
    setLoading(true)
    const url = await generateImage(prompt)
    if (url) {
      setImageUrl(url)
    }
    setLoading(false)
  }

  const handleDownload = async () => {
    if (!imageUrl) return

    try {
      let fileUri = `${FileSystem.documentDirectory}image.jpg`

      if (imageUrl.startsWith("data:image")) {
        const base64Code = imageUrl.split("base64,")[1]
        await FileSystem.writeAsStringAsync(fileUri, base64Code, {
          encoding: FileSystem.EncodingType.Base64
        })
      } else {
        const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri)
        fileUri = uri
      }

      if (Platform.OS === "ios") {
        await Sharing.shareAsync(fileUri)
      } else {
        const asset = await MediaLibrary.createAssetAsync(fileUri)
        await MediaLibrary.createAlbumAsync("Descargas", asset, false)
        Alert.alert(
          "Imagen guardada",
          "Revisa tu galería en la carpeta 'Descargas'."
        )
      }
    } catch (error) {
      console.error("Error al descargar la imagen:", error)
      Alert.alert("Error", "No se pudo descargar la imagen.")
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
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

        {imageUrl && (
          <>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <Button title="📥 Descargar Imagen" onPress={handleDownload} />
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa"
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20
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
    marginTop: 10,
    marginBottom: 10
  }
})

export default HomeScreen
