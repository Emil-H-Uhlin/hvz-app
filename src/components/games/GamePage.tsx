import { withAuthenticationRequired } from "@auth0/auth0-react"

export function GamePage() {

    return <>
        games
    </>
}

export default withAuthenticationRequired(GamePage)
