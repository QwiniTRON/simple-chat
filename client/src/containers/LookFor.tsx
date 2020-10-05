import React, { FormEvent, useContext, useState } from 'react'
import './LookFor.css'
import Header from '../components/Navigation/Header'
import { UserValueContext } from '../store/user/Provider'
import { userContext } from '../store/user/context'
import { Link } from 'react-router-dom'
import { PeoplelistValueContext } from '../store/peoplelist/Provider'
import { peopleListContext } from '../store/peoplelist/context'
import Loader from '../components/UI/Loader/Loader'
import { IUser } from '../Types'

const LookFor: React.FC = function (props) {
  const [search, setSearch] = useState('')
  const userStore: UserValueContext = useContext(userContext)
  const peoplelistStore: PeoplelistValueContext = useContext(peopleListContext)

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!peoplelistStore.state.lodaing &&
      search.length >= 1)
      peoplelistStore.methods.searchUsers(search)

  }

  return (
    <div className="lookfor">
      <Header isAuth={!!userStore.state.id} />

      {!userStore.state.id &&
        <div className="wrapper">
          <p>Для поиска нужно войти.</p>
          <Link to="/auth">Войти</Link>
        </div>
      }

      { userStore.state.id &&
        <div className="lookfor__container">
          <div className="search-block">
            <form onSubmit={handleSearch}>
              <input value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                name="search"
                type="text" />
              <button type="submit">search</button>
            </form>
          </div>

          <div className="lookfor__lists">
            <div className="users">
              <h3>Поиск</h3>

              {peoplelistStore.state.lodaing && <Loader color="green" />}

              {peoplelistStore.state.searchlist.map((person: IUser) => {
                if (person._id == userStore.state.id) return null
                if (peoplelistStore.state.friendslist.some((f: IUser) => f._id == person._id)) return null
                if (peoplelistStore.state.requests.some((f: IUser) => f._id == person._id)) return null
                if (peoplelistStore.state.invites.some((f: IUser) => f._id == person._id)) return null

                return (
                  <div key={person.nickname} className="users__item">
                    {person.nickname}
                    <button onClick={() => {
                      if (peoplelistStore.state.lodaing) return

                      peoplelistStore.methods.requestToFriend(person._id)
                    }}>
                      <i className="material-icons">group_add</i>
                    </button>
                  </div>
                )
              })}
            </div>

          </div>
        </div>
      }
    </div>
  );
}

export default LookFor