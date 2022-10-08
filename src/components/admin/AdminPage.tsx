import { withAuthenticationRequired } from "@auth0/auth0-react"

export function AdminPage() {

    return <>
         { /* REDIRECT IF USER NOT ADMIN: <Navigate replace to="/"></Navigate> */ }
    </>
}

export default withAuthenticationRequired(AdminPage)
