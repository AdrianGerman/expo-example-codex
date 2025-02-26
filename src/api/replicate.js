import { supabase } from "./supabase"

export const generateImage = async (prompt) => {
  const { data, error } = await supabase.functions.invoke("generateFreeImage", {
    body: { prompt }
  })

  if (error) {
    console.error("Error generando imagen:", error)
    return null
  }

  if (!data.output.startsWith("data:image/png;base64,")) {
    console.error("Formato de imagen inesperado:", data)
    return null
  }

  return data.output
}
