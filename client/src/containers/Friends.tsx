import React, { useContext } from 'react'

import './Friends.css'
import Header from '../components/Navigation/Header'
import { UserValueContext } from '../store/user/Provider'
import { userContext } from '../store/user/context'
import { PeoplelistValueContext } from '../store/peoplelist/Provider'
import { peopleListContext } from '../store/peoplelist/context'
import { Link } from 'react-router-dom'
import Loader from '../components/UI/Loader/Loader'
import { IUser } from '../Types'

const Friends: React.FC = function (props) {
  const userStore: UserValueContext = useContext(userContext)
  const listStore: PeoplelistValueContext = useContext(peopleListContext)

  if (!userStore.state.id) return (
    <div className="friends-page">
      <Header isAuth={!!userStore.state.id} />
      <div className="wrapper">
        Для просмотра друзей нужно войти
        <br />
        <br />
        <Link to="/auth">Войти</Link>
      </div>
    </div>
  )

  return (
    <div className="friends-page">
      <Header isAuth={!!userStore.state.id} />
      <div className="friends-page__container">
        <div className="invites">
          <h3>Приглашения</h3>

          {listStore.state.lodaing && <Loader color="green" />}

          {listStore.state.invites.map((i: IUser) => {
            return (
              <div key={i.nickname} className="item">
                {i.nickname}
                <div className="item__buttons">
                  <button className="item__btn item__btn--red"
                  onClick={() => {
                    if(listStore.state.lodaing) return

                    listStore.methods.cancelInvite(i._id)
                  }}>
                    <i className="material-icons">clear</i>
                  </button>
                  <button className="item__btn"
                  onClick={() => {
                    if(listStore.state.lodaing) return

                    listStore.methods.addFriend(i._id)
                  }}>
                    <i className="material-icons">group_add</i>
                  </button>
                </div>
              </div>
            )
          })}

          <p>отправленные: </p>

          {listStore.state.requests.map((r: IUser) => {
            return (
              <div key={r._id} className="item">
                {r.nickname}
                <div>
                  ожидание ответа
                </div>
              </div>)
          })}

        </div>
        <div className="friends">
          <h3>Друзья</h3>

          {listStore.state.friendslist.map((f: IUser) => {
            return (
              <div key={f._id} className="item">
                {f.nickname}
                <button className="item__btn item__btn--red"
                onClick={() => {
                  if(listStore.state.lodaing) return

                  if(!window.confirm('Точно удалить?')) return

                  listStore.methods.removeFriend(f._id)
                }}>
                  <i className="material-icons">clear</i>
                </button>
              </div>
            )
          })}

        </div>
      </div>
    </div>
  );
}

export default Friends