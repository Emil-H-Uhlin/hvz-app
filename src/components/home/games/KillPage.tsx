import { withAuthenticationRequired } from "@auth0/auth0-react";

import { useSearchParams, useNavigate } from 'react-router-dom'
import {useEffect, useContext} from 'react'

import {UserContext, getAuthHeaders} from '../../../UserProvider'

function KillPage() {
	// @ts-ignore
	const [hvzUser] = useContext(UserContext)

	const [searchParams] = useSearchParams()
	const navigate = useNavigate()

	useEffect(() => {
		(async function() {
			const response = await fetch(`${process.env.REACT_APP_HVZ_API_BASE_URL}/games/${searchParams.get("game_id")}/kills`, {
				method: "POST",
				headers: {
					"Content-Type":"application/json",
					...getAuthHeaders(hvzUser)
				},
				body: JSON.stringify({
					victimBiteCode: searchParams.get("bitecode"),
					story: "is ded",
					lat: 0.0,
					lng: 0.0
				})
			})

			console.log(await response.json())

			//navigate("/home")
		})()
	}, [])

	return <></>
}

export default withAuthenticationRequired(KillPage)