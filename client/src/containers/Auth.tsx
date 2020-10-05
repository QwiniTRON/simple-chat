import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import LoginForm from '../components/Forms/Loginform'
import RegisterForm from '../components/Forms/Registerform'
import { userContext } from '../store/user/context'
import { UserValueContext } from '../store/user/Provider'
import mrq from '../myrequest/Myrequest'
import './Auth.css'

const Auth: React.FC = function (props) {
  const [isLoginform, setIsLoginform] = useState(true)
  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false)
  const userStore: UserValueContext = useContext(userContext)

  const handleRegister = async (values: any) => {
    userStore.methods.setUserLoading(true)
    const response = await mrq.post('/auth/register', {
      mail: values.email,
      password: values.password,
      nickname: values.nickname
    })
    if (response.ok) setIsRegisterSuccess(true)
    else userStore.methods.setUserError(response.message || 'неясная ошибка, попробуйте снова')
    userStore.methods.setUserLoading(false)
  }
  const handleLogin = (values: any) => {
    userStore.methods.login(values.email, values.password)
  }
  const toggleForm = () => setIsLoginform(!isLoginform)

  return (
    <div className="auth">
      <div className="auth__content">
        <Link className="auth__back" to="/chat"><i className="material-icons">arrow_back</i> назад</Link>
        <h2>{isLoginform ? 'Вход' : 'Регистрация'}</h2>

        <p className="error-notice">{userStore.state.error}</p>

        {isLoginform ? <LoginForm isLoading={userStore.state.loading} submitHandle={handleLogin} /> :
          (
            isRegisterSuccess ?
              <div>Вы зарегистрированы! <p onClick={toggleForm} style={{ cursor: 'pointer' }}>войти</p></div> :
              <RegisterForm isLoading={userStore.state.loading} submitHandle={handleRegister} />
          )
        }

        {!isRegisterSuccess && <p onClick={toggleForm} style={{ cursor: 'pointer' }}>
          перейти к
          {isLoginform ? ' регистрации' : ' входу'}
        </p>}
      </div>
    </div>
  );
}

export default Auth