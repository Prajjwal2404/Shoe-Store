import { redirect } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default async function HandleAuth(formData) {

    if (formData.get('logMail')) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.get('logMail'),
                    password: formData.get('logPass'),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            if (data.token) {
                if (formData.get('remember')) localStorage.setItem('token', data.token);
                else sessionStorage.setItem('token', data.token);
                return { success: true, redirect: true };
            } else {
                throw new Error('Login successful, but no token received.');
            }
        } catch (err) {
            throw { login: err.message };
        }
    } else if (formData.get('regUser')) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.get('regUser'),
                    email: formData.get('regMail'),
                    password: formData.get('regPass'),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            if (data.token) {
                sessionStorage.setItem('token', data.token);
                return { success: true, redirect: true };
            } else {
                throw new Error('Register successful, but no token received.');
            }

        } catch (err) {
            throw { register: err.message };
        }
    } else if (formData.get('resetUser')) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/reset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.get('resetUser'),
                    email: formData.get('resetMail')
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Password reset failed');
            }
            return { success: true, message: data.message || 'Password reset link sent' };

        } catch (err) {
            throw { change: err.message };
        }
    }
    return { error: "Unknown form submission" };
}

export async function RequireAuth(request) {
    const token = getCurrentUserToken();

    if (!token) {
        const pathname = new URL(request.url).pathname;
        throw redirect(`/login?redirectTo=${pathname}`);
    } else {
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                sessionStorage.removeItem('token');
                localStorage.removeItem('token');
                const pathname = new URL(request.url).pathname;
                throw redirect(`/login?redirectTo=${pathname}`);
            } else {
                throw new Error('Failed to verify token');
            }
        }
    }

    return null;
}

export function getCurrentUserToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
}