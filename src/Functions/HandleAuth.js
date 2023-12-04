import { db, auth } from "../DB/FirebaseConfig"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, setPersistence, browserSessionPersistence, browserLocalPersistence, sendPasswordResetEmail } from "firebase/auth"
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore/lite"

export default async function HandleAuth(formData) {

    if (formData.get('logMail')) {
        try {
            if (!formData.get('remember')) {
                await setPersistence(auth, browserSessionPersistence)
            }
            else {
                await setPersistence(auth, browserLocalPersistence)
            }
            const path = window.location.pathname
            await signInWithEmailAndPassword(auth, formData.get('logMail'), formData.get('logPass'))
            return { success: true, redirect: true, path: path }
        }
        catch (err) {
            if (err.message == 'Firebase: Error (auth/invalid-login-credentials).') {
                throw { login: 'Incorrect email or password' }
            }
            else {
                console.error(err)
                alert(err.message)
            }
        }
    }

    else if (formData.get('regUser')) {

        try {
            const usersRef = collection(db, 'Users')
            const q = query(usersRef, where('usernameLower', '==', formData.get('regUser').toLowerCase()))
            const check = await getDocs(q)
            if (!check.empty) {
                throw 'matched'
            }
            const path = window.location.pathname
            await createUserWithEmailAndPassword(auth, formData.get('regMail'), formData.get('regPass'))
            const userRef = doc(db, 'Users', auth.currentUser.uid)
            const fields = {
                username: formData.get('regUser'), usernameLower: formData.get('regUser').toLowerCase(),
                email: auth.currentUser.email.toLowerCase(), wishlist: [], cart: [], addresses: [], orders: []
            }
            await setDoc(userRef, fields)
            return { success: true, redirect: true, path: path }
        }
        catch (err) {
            if (err === 'matched') {
                throw { register: 'Username already exists' }
            }
            else {
                console.error(err)
                alert(err.message)
            }
        }
    }

    else {
        try {
            const usersRef = collection(db, 'Users')
            const q = query(usersRef, where('usernameLower', '==', formData.get('resetUser').toLowerCase()))
            const check = await getDocs(q)
            if (!check.empty) {
                if (check.docs[0].get('email') !== formData.get('resetMail').toLowerCase()) throw 'unmatched'
            }
            else {
                throw 'unmatched'
            }
            await sendPasswordResetEmail(auth, formData.get('resetMail'))
            return { success: true }
        }
        catch (err) {
            if (err == 'unmatched') {
                throw { change: "Username or Email doesn't exists" }
            }
            else {
                console.error(err)
                alert(err.message)
            }
        }
    }
}