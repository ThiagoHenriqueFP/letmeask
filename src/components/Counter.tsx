import { useState } from "react";

export function Counter(){
const [counter, SetCounter] = useState(0)

function increment (){
    SetCounter(counter + 1)
    //Imutabilidade, o React irá criar uma nova informação em vista da ourta anterior
}
    
    return (
        <button onClick={increment}>{counter}</button>
    )
}