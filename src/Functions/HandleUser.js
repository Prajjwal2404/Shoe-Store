import { redirect } from 'react-router-dom'
import { auth } from '../DB/FirebaseConfig'
import { onAuthStateChanged } from "firebase/auth"

export default async function RequireAuth(request) {

    if (!await CurrentUser()) {
        let pathname = new URL(request.url).pathname
        throw redirect(`/login?redirectTo=${pathname}`)
    }

    return null
}

export async function CurrentUser() {
    return new Promise(function (resolve) {
        onAuthStateChanged(auth, userC => resolve(userC))
    })
}
