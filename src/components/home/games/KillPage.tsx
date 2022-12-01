import { withAuthenticationRequired } from "@auth0/auth0-react";

import { useParams, useNavigate } from 'react-router'
import {useContext, useEffect, useState} from 'react'
import {UserContext, getAuthHeaders} from '../../../UserProvider'
import {KillModel} from "../../../Models"

function KillPage() {
	// @ts-ignore
	const hvzUser = useContext(UserContext)

	const { biteCode } = useParams()
	const navigate = useNavigate()

	const [formState, setFormState] = useState<KillModel>({
		victimBiteCode: "",
		lat: 0.0,
		lng: 0.0,
		story: ""
	})

	useEffect(function() {
		if (biteCode === undefined) navigate("/home");

		setFormState({
			victimBiteCode: biteCode!,
			lat: 0.0,
			lng: 0.0,
			story: ""
		})

	}, [biteCode, navigate])

	async function submitKill(event: any) {
		event.preventDefault()

		await fetch(`${process.env.REACT_APP_HVZ_API_BASE_URL}/kills`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...getAuthHeaders(hvzUser!)
			},
			body: JSON.stringify(formState)
		})

		navigate("/home")
	} 

	function handleOnChange(event: any) {
		setFormState((prev : KillModel) => {
			const newState = {
				...prev,
				[event.target.name] : event.target.value
			}

			return newState
		})
	}

	return <div>
		<form onSubmit={submitKill} onChange={handleOnChange}>
			<fieldset>
				<label>Story</label>
				<textarea name="story" />
			</fieldset>
			<fieldset>
				<div>
					<label>Latitude (x)</label>
					<input type="number" name="lat" step="0.01" />
				</div>
				<div>
					<label>Longitude (y)</label>
					<input type="number" name="lng" step="0.01" />
				</div>
			</fieldset>
				<button type="submit">Submit kill</button>
		</form>
	</div>
}

export default withAuthenticationRequired(KillPage)