import { useEffect, useState } from "react"
import { database } from "../services/firebase"
import { useAuth } from "./AuthContext"

type FirebaseQuestions = Record<string, {
    author: {
        nome: string,
        avatar: string
    },
    content: string,
    isAnswered: boolean,
    isHighLighted: boolean,
    likes: Record<string, {
        authorId: string
    }>
}>
  
type Questions = {
    id: string, 
    author: {
        nome: string,
        avatar: string
    },
    content: string,
    isAnswered: boolean,
    isHighLighted: boolean,
    likeCount: number,
    likedId: string | undefined
}

export function useRoom(roomId: string){
    const { user } = useAuth()
    const [questions, setQuestions] = useState<Questions[]>([])
    const [title, setTitle] = useState('')


    useEffect(()=>{
        const roomRef = database.ref(`/rooms/${roomId}`)
        roomRef.on('value', room=>{
            const databaseRoom = room.val()
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}
            
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value])=>{
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighLighted: value.isHighLighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likedId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
                }
            })

            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions)
        })

        return () => {
            roomRef.off('value')
        }
    }, [roomId, user?.id])

    return {questions, title}

}