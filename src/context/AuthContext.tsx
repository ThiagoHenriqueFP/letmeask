import { ReactNode, createContext, useEffect, useState } from "react";
import { auth, firebase } from '../services/firebase'

type User = {
    id: string,
    name: string,
    avatar: string
  }
  
  type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: ()=>Promise<void>;
  }

export const AuthContext = createContext({} as AuthContextType)
type AuthContextProviderProps= {
    children?: ReactNode
}


export function AuthContextProvider(props: AuthContextProviderProps){

    const [user, setUser] = useState<User>()

    useEffect(()=>{
      const unsubiscribe = auth.onAuthStateChanged(user=>{
        if(user){
        const { uid, displayName, photoURL } = user
  
        if(!displayName || !photoURL){
          throw new Error('Missing information of Google account')
        }
  
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
        }
      })
  
      return () => {
        unsubiscribe()
      }
    }, [])
  
    async function signInWithGoogle(){
      const provider = new firebase.auth.GoogleAuthProvider()
      
      const result = await auth.signInWithPopup(provider)
  
      if(result.user){
        const { uid, displayName, photoURL } = result.user
  
        if(!displayName || !photoURL){
          throw new Error('Missing information of Google account')
        }
  
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
        }
    }
  

    return(
        <AuthContext.Provider value={{user, signInWithGoogle}}>
            {props.children}
        </AuthContext.Provider>
    )
}