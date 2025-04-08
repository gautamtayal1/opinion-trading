import { useCallback, useEffect, useRef, useState } from "react";

export function useWebSocket(url: string) {
  const ws = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<string[]>([])
  const messageHandlers = useRef<Map<string, (data: any) => void>>(new Map())

  useEffect(() => {
    if(!url) return

    ws.current = new WebSocket(url)

    ws.current.onopen = () => {
      console.log("websocket connected")
      setIsConnected(true)
    }

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        
        if (data.event === "message" && data.channel) {
          const handler = messageHandlers.current.get(data.channel)
          if(handler) {
            handler(data.data)
          }
        }
        setMessages((prev) => [...prev, data])
      } catch (error) {
        setMessages((prev) => [...prev, event.data])
        console.log(error)
      }
    }
    ws.current.onclose = () => {
      console.log("websocket disconnected")
      setIsConnected(false)
    }
    return () => {
      ws.current?.close()
    }
  }, [url])

  const subscribe = useCallback((channel: string, callback?: (data: any) => void) =>  {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        method: "subscribe_orderbook",
        events: [channel]
      }))

      if (callback) {
        messageHandlers.current.set(channel, callback)
      }

      return true
    }
    return false
  }, [])

  const unsubscribe = useCallback((channel: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        method: "unsubscribe_orderbook",
        events: [channel]
      }))

      messageHandlers.current.delete(channel)

      return true
    }
    return false
  }, [])

  const publish = useCallback((channel: string, data: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        method: "publish",
        channel,
        data
      }))
      return true
    }
    return false
  }, [])

  // const sendMessage = (message: string) => {
  //   if (ws.current && ws.current.readyState === WebSocket.OPEN) {
  //     ws.current.send(message)
  //   }
  // }

  return {
    isConnected, 
    messages, 
    subscribe,
    unsubscribe,
    publish
  }
}