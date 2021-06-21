import {useHistory, useParams} from 'react-router-dom'

import LogoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

import { Button } from '../components/Button'
import { Question } from '../components/Questions'
import { RoomCode } from '../components/RoomCode'
/* import { useAuth } from '../Hooks/AuthContext' */
import { useRoom } from '../Hooks/useRoom'
import { database } from '../services/firebase'
import '../styles/Room.scss'


type RoomParams = {
    id: string
}

export function AdminRoom(){
    const history = useHistory()
    const params = useParams<RoomParams>()
    /* const { user } = useAuth() */
    const roomId = params.id

    const {questions, title} = useRoom(roomId)

    async function handleEndRoom(){
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date()
        })

        history.push('/')
    }

    async function handleCheckQuestionsAsAnswered(questionId: string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true
        })
    }

    async function handleHighLightQuestions(questionId: string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighLighted: true
        })
    }

    async function handleDeleteQuestions(questionId: string){
        
        if(window.confirm("tem certeza que deseja excuir essa pergunta")){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={LogoImg} alt="Letmeask" />
                    <div>
                    <RoomCode code={roomId}/>
                    <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>


            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergutas</span>}
                </div>
                
            <div className="questions-list">
                {questions.map(question=> {
                    return(
                        <Question 
                            key={question.id}
                            content={question.content}
                            author={question.author}
                            isAnswered={question.isAnswered}
                            isHighLighted={question.isHighLighted}
                        >
                            {!question.isAnswered && (
                            <>    
                                <button
                                type="button"
                                onClick={()=> handleCheckQuestionsAsAnswered(question.id)}
                                >
                                    <img src={checkImg} alt="marcar pergunta como respondida" />
                                </button>

                                <button
                                type="button"
                                onClick={()=> handleHighLightQuestions(question.id)}
                                >
                                    <img src={answerImg} alt="destacar pergunta" />
                                </button>
                            </>
                            )}
                            <button
                            type="button"
                            onClick={()=> handleDeleteQuestions(question.id)}
                            >
                                <img src={deleteImg} alt="Remover pergunta" />
                            </button>
                        </Question>
                    )
                })}
            </div>
            </main>
        </div>
    )
}