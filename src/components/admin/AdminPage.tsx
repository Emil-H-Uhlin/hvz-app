import { withAuthenticationRequired } from "@auth0/auth0-react"
import { useEffect } from "react"
import { Navigate } from "react-router-dom"
import { hvzUser } from "../../App"

export function AdminPage({ user }: { user: hvzUser | null }) {

    return <>
         { !user?.isAdmin && <Navigate replace to="/"></Navigate> }
    </>
}

export default withAuthenticationRequired(AdminPage)
