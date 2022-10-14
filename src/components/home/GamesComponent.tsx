import { useContext, useEffect, useState } from "react"
import {getAuthHeaders, UserContext} from "../../UserProvider"
import {useQuery} from "react-query";

export default function GamesComponent() {
    // @ts-ignore
    const [hvzUser] = useContext(UserContext)

    // @ts-ignore
    const { games, status } = useQuery("games", async function() {
        const response = await fetch(`${process.env.REACT_APP_HVZ_API_BASE_URL}/games`, {
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(hvzUser)
            }
        })

        return response.json()
    })

    return hvzUser && <>
        { games && <p>{games.length}</p> }
    </>
}