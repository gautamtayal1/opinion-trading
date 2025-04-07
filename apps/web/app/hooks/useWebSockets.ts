import { useEffect, useRef, useState } from "react";

export function useWebSocket(url: string) {
  const ws = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    if(!url) return

    ws.current = new WebSocket(url)

    ws.current.onopen = () => {
      console.log("websocket connected")
      setIsConnected(true)
    }

    ws.current.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data])
    }

    ws.current.onclose = () => {
      console.log("websocket disconnected")
      setIsConnected(false)
    }

    ws.current.onerror = (err) => {
      console.error("websocket error: ", err)
    }

    return () => {
      ws.current?.close()
    }
  }, [url])

  const sendMessage = (message: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message)
    }
  }

  return {isConnected, messages, sendMessage}
}