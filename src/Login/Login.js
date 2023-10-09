import React from 'react'
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import HandleAuth from '../Functions/HandleAuth';
import { IoMailOutline, IoCloseOutline, IoLockClosedOutline, IoPersonOutline } from 'react-icons/io5'
import './Login.css'

export async function action({ request }) {
    const formData = await request.formData()
    try {
        const result = await HandleAuth(formData)
        if (result.redirect) {
            let pathname = new URL(request.url).searchParams.get('redirectTo') || '/'
            throw redirect(pathname)
        }
        return result
    }

    catch (err) {
        return err
    }

    finally {
        reset()
    }
}

function reset() {
    Array.from(document.getElementsByClassName('form')).forEach(el => el.reset());
    Array.from(document.getElementsByClassName('form-input')).forEach(el => el.setAttribute('empty', ''));
}

export default function Login({ wrapper }) {

    const navigation = useNavigation();

    const actionData = useActionData();
    const login = actionData?.login;
    const register = actionData?.register;
    const change = actionData?.change;

    if (actionData?.success) {
        loginClose()
    }


    function active() {
        wrapper.current[0].classList.toggle('active');
    }

    function activePass() {
        wrapper.current[0].classList.toggle('active-pass');
    }

    function loginClose() {
        wrapper.current[0].style.transform = "scale(0)";
        setTimeout(() => {
            wrapper.current[0].style.display = "none"
            wrapper.current[0].classList.remove('active', 'active-pass')
        }, 500);
    }


    return (
        <div className="outerest">
            <div className="wrapper" ref={el => wrapper.current[0] = el}>
                <span className="icon-close" onClick={loginClose}><IoCloseOutline /></span>
                <div className="form-box login">
                    <h2 className={login ? 'error' : ''}>Login</h2>
                    {login && <h4>{login}</h4>}
                    <Form className='form' method='post' replace>
                        <div className="input-box">
                            <span className="icon"><IoMailOutline /></span>
                            <input className='form-input' type="email" required name="logMail" empty=''
                                onChange={(e) => e.target.setAttribute('empty', e.target.value)} />
                            <label>Email</label>
                        </div>
                        <div className="input-box">
                            <span className="icon"><IoLockClosedOutline /></span>
                            <input className='form-input' type="password" required name="logPass" minLength={8} empty=''
                                onChange={(e) => e.target.setAttribute('empty', e.target.value)} />
                            <label>Password</label>
                        </div>
                        <div className="remember-forgot">
                            <label><input type="checkbox" name="remember" />Remember me</label>
                            <a className="forgot-link" onClick={activePass}>Forgot Password</a>
                        </div>
                        <button disabled={navigation.state === 'submitting'} type="submit" className="btn">
                            {navigation.state === 'submitting' ? 'Logging in...' : 'Log in'}
                        </button>
                        <div className="login-register">
                            <p>Don't have an account ? <a className="register-link" onClick={active}>Register</a></p>
                        </div>
                    </Form>
                </div>
                <div className="form-box register">
                    <h2 className={register ? 'error' : ''}>Registration</h2>
                    {register && <h4>{register}</h4>}
                    <Form className='form' method='post' replace>
                        <div className="input-box">
                            <span className="icon"><IoPersonOutline /></span>
                            <input className='form-input' type="text" required name="regUser" empty=''
                                onChange={(e) => e.target.setAttribute('empty', e.target.value)} />
                            <label>Username</label>
                        </div>
                        <div className="input-box">
                            <span className="icon"><IoMailOutline /></span>
                            <input className='form-input' type="email" required name="regMail" empty=''
                                onChange={(e) => e.target.setAttribute('empty', e.target.value)} />
                            <label>Email</label>
                        </div>
                        <div className="input-box">
                            <span className="icon"><IoLockClosedOutline /></span>
                            <input className='form-input' type="password" required name="regPass" minLength={8} empty=''
                                onChange={(e) => e.target.setAttribute('empty', e.target.value)} />
                            <label>Password</label>
                        </div>
                        <div className="remember-forgot">
                            <label><input type="checkbox" required name="agree" />
                                I agree to the terms & conditions
                            </label>
                        </div>
                        <button disabled={navigation.state === 'submitting'} type="submit" className="btn">
                            {navigation.state === 'submitting' ? 'Registering...' : 'Register'}
                        </button>
                        <div className="login-register">
                            <p>Already have an account ? <a className="login-link" onClick={active}>Login</a></p>
                        </div>
                    </Form>
                </div>
                <div className="form-box forgot-pass">
                    <h2 className={change ? 'error' : ''}>Reset Password</h2>
                    {change && <h4>{change}</h4>}
                    <Form className='form' method='post' replace>
                        <div className="input-box">
                            <span className="icon"><IoPersonOutline /></span>
                            <input className='form-input' type="text" required name="resetUser" empty=''
                                onChange={(e) => e.target.setAttribute('empty', e.target.value)} />
                            <label>Username</label>
                        </div>
                        <div className="input-box">
                            <span className="icon"><IoMailOutline /></span>
                            <input className='form-input' type="email" required name="resetMail" empty=''
                                onChange={(e) => e.target.setAttribute('empty', e.target.value)} />
                            <label>Email</label>
                        </div>
                        <button disabled={navigation.state === 'submitting'} type="submit" className="btn">
                            {navigation.state === 'submitting' ? 'Changing...' : 'Change'}
                        </button>
                        <div className="login-register">
                            <p>Remember your password ? <a className="login-back" onClick={activePass}>Login</a></p>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}
