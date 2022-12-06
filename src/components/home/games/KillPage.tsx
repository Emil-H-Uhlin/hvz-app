import {UserContext, getAuthHeaders} from '../../../UserProvider'
import {GameModel, jsonToGameModel, KillModel} from "../../../Models"
import {HvzMap} from "./GamePage";

import React, {useContext, useEffect, useState} from 'react'
import { useParams, useNavigate } from 'react-router'
import {useQuery} from "react-query";

import { withAuthenticationRequired } from "@auth0/auth0-react";

import {CircleMarker, MapContainer, Marker, Rectangle} from "react-leaflet";
import {Map} from "leaflet";

function KillPage() {
	// @ts-ignore
	const hvzUser = useContext(UserContext)

	const { biteCode, gameId } = useParams()
	const navigate = useNavigate()

	const [formState, setFormState] = useState<KillModel>({
		victimBiteCode: "",
		lat: 0.0,
		lng: 0.0,
		story: ""
	})

	const {data: game} = useQuery<GameModel>(`kill-page-game${gameId}`, async function() {
		const response = await fetch(`${process.env.REACT_APP_HVZ_API_BASE_URL}/games/${gameId}`, {
			headers: {
				"Content-Type": "application/json",
				...getAuthHeaders(hvzUser!)
			}
		})

		return jsonToGameModel(await response.json())
	}, {
		enabled: hvzUser !== null && gameId !== undefined
	})

	useEffect(function() {
		if (biteCode === undefined || gameId === undefined || game === undefined) navigate("/home");

		setFormState({
			victimBiteCode: biteCode!,
			lat: (game!.nw[0] + game!.se[0]) / 2,
			lng: (game!.nw[1] + game!.se[1]) / 2,
			story: ""
		})

	}, [biteCode, gameId, navigate, game])

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
					<label>Longitude (x)</label>
					<input type="number" name="lng" step="0.00005" value={formState.lng} readOnly />
				</div>
				<div>
					<label>Latitude (y)</label>
					<input type="number" name="lat" step="0.00005" value={formState.lat} readOnly />
				</div>
			</fieldset>
				<button type="submit">Submit kill</button>
		</form>
		{ game &&
		<div className="hvz-leaflet-container">
			<MapContainer>
				<HvzMap mapSetup={(map: Map) => {
					map.fitBounds([game.nw, game.se])
					map.doubleClickZoom.disable()
					map.dragging.disable()

					map.removeEventListener("click") // clear click event to prevent multiple

					map.addEventListener("click", ({latlng}) => {
						setFormState((prev: KillModel) => {
							const newState = {
								...prev,
								lat: latlng.lat,
								lng: latlng.lng
							}

							return newState
						})
					})
				}}/>
				<CircleMarker center={[formState.lat, formState.lng]} />
				<Rectangle bounds={[game.nw, game.se]} />
			</MapContainer>
		</div> }
	</div>
}

export default withAuthenticationRequired(KillPage)