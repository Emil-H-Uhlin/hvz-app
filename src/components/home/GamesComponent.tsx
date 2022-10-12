import { useContext, useEffect, useState } from "react"
import { GameModel } from "../../models/GameModel"
import { UserContext } from "../../UserProvider"
import GamesListItem from "./GamesListItem"

export default function GamesComponent() {
    // @ts-ignore
    const [hvzUser] = useContext(UserContext)
    const [games, setGames] = useState<JSX.Element[]>([])
    
    useEffect(() => {
        
        (async function() {
            const response = await fetch(`${process.env.REACT_APP_HVZ_API_BASE_URL}/games`, {
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${hvzUser.token}`
                }
            })

            setGames((await response.json()).map((g: GameModel) => <GamesListItem game={g} key={g.id}/>))
        })()

    }, [hvzUser])
    
    return hvzUser && <>
        { games }
    </>
}