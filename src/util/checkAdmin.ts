import jwtDecode from 'jwt-decode'

export default function checkIfAdmin(token: string) {
    const decoded: { permissions: [] } = jwtDecode(token)

    return decoded.permissions.filter((it: string) => it.startsWith("ADMIN_")).length === 3
}