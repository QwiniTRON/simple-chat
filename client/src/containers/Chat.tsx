import React, { useContext, useEffect, useRef, useState } from 'react'
import Header from '../components/Navigation/Header'
import { userContext } from '../store/user/context'
import { UserValueContext } from '../store/user/Provider'
import { PeoplelistValueContext } from '../store/peoplelist/Provider'
import { peopleListContext } from '../store/peoplelist/context'
import { chatContext } from '../store/chat/context'
import { ChatValueContext } from '../store/chat/Provider'
import { Link, NavLink } from 'react-router-dom'
import { RouteComponentProps } from 'react-router'
import { IMessage, IUser } from '../Types'
import './Chat.css'
import SidePanel from '../components/SlideMenu/SlideMenu'
import Loader from '../components/UI/Loader/Loader'

type ChatRoute = {
  id: string
}

interface ChatProps extends RouteComponentProps<ChatRoute> {
}

const Chat: React.FC<ChatProps> = function (props) {
  const userStore: UserValueContext = useContext(userContext)
  const listStore: PeoplelistValueContext = useContext(peopleListContext)
  const chatStore: ChatValueContext = useContext(chatContext)
  const sideMenuHelperRef = useRef<any>(null)
  const [isEdited, setIsEdited] = useState(false)
  const messageRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [messageError, SetMessageError] = useState('')
  const frendId = props.match.params.id
  const [isFileSelected, setIsFileSelected] = useState(false)

  const sendFunction = () => {
    if (!frendId) return

    const text = messageRef.current?.textContent?.trim()
    const file = fileRef.current?.files![0]

    if(text?.length! > 1000) {
      return SetMessageError("сообщение не длинее 1000 символов")
    }

    if (file && file.size > 2e6) {
      return SetMessageError("файл не более 2 мб")
    }

    if (text?.length! == 0 && !file) {
      return SetMessageError("не менее 1 символа")
    }

    SetMessageError("")
    chatStore.methods.postMessage(frendId, String(text), file)
    messageRef.current!.textContent = ''
    fileRef.current!.value = ''
    setIsFileSelected(false)
  }

  useEffect(() => {
    if (frendId && chatStore.state.isINIT) {
      chatStore.methods.getMessages(frendId)

      listStore.methods.setPeoplelistFrendIsmessage(frendId, false)
    }
  }, [frendId, chatStore.state.isINIT])

  if (!userStore.state.id) {
    return (
      <div className="chat">
        <Header isAuth={!!userStore.state.id} />
        <main className="chat__content">
          <SidePanel helper={sideMenuHelperRef} >
            <div className="side-bar__container">
              <div className="side-bar__title">
                Друзья
                <p>ваш ник: {userStore.state.nickname}</p>
              </div>

              <div className="side-bar">

              </div>
            </div>
          </SidePanel>

          <div className="content">
            <div className="messages">
              Чтобы общаться нужно авторизоваться <br />
              <Link to="/auth">Войти</Link>
            </div>
            <div className="sender">
            </div>
          </div>
        </main>
        <footer>footer</footer>
      </div>
    )
  }

  // разметка сообщений
  let messagesJsx = null
  if (frendId) {
    messagesJsx = chatStore.state.messages.map((m: IMessage) => {
      const isPerson = m.author._id == userStore.state.id
      const dateString = new Date(m.date).toLocaleString('ru')

      return (
        <div key={m.date + m.author.nickname} className={`message ${isPerson ? "message--left" : ''}`}>
          <div className="message__content">
            <div className="message__title">{m.author.nickname} <span>{dateString}</span></div>
            {m.text}
            {m.img_path &&
              <div className="message__content-img">
                <img src={`/${m.img_path}`} alt="message-photo"/>
              </div>}
          </div>
        </div>
      )
    })
  }


  return (
    <div className="chat">
      <Header isAuth={!!userStore.state.id} />
      <main className="chat__content">
        <SidePanel helper={sideMenuHelperRef} >
          <div className="side-bar__container">
            <div className="side-bar__title">
              Друзья
            <p>ваш ник: {userStore.state.nickname}</p>
            </div>
            <div className="side-bar">

              {listStore.state.friendslist.map((f: IUser) => {
                return (
                  <NavLink key={f._id} to={`/chat/${f._id}`} className="side-bar__item">
                    {f.nickname}
                    {f.isOnline && <div className="side-bar__item-status"></div>}
                    {f.isNewMessage && <div className="side-bar__item-status side-bar__item-status--message"></div>}
                  </NavLink>
                )
              })}
            </div>

            {/* <div className="side-bar">
            <div className="side-bar__item">User 1 <div className="side-bar__item-status"></div></div>
            <div className="side-bar__item active">User 2</div>
            <div className="side-bar__item">User 3</div>
            <div className="side-bar__item">User 4</div>
          </div> */}
          </div>
        </SidePanel>

        <div className="content">
          <div className="messages">

            {messagesJsx}

            {chatStore.state.loading && <Loader color="green" />}

          </div>
          <div className="sender">
            {messageError && <div className="message-error">{messageError}</div>}
            <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault()
              sendFunction()
            }}>
              <div
                ref={messageRef}
                suppressContentEditableWarning={true}
                className="sender__input"
                contentEditable="true"
                onInput={(e: any) => {
                  if ((e.target as HTMLDivElement).textContent!.length > 0) {
                    if (!isEdited) setIsEdited(true)
                  }

                  if ((e.target as HTMLDivElement).textContent!.length == 0 && isEdited)
                    setIsEdited(false)
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                  if (e.key == 'Enter') {
                    e.preventDefault()
                    sendFunction()
                  }
                }}>
              </div>
              {!isEdited && <span className="sender__input-label">ваше сообщение</span>}

              <div className="sender__buttons">
                <label className="sender__file-label sender__btn">
                  <i className="material-icons">attach_file</i>
                  <input
                    ref={fileRef}
                    accept="image/*"
                    className="sender__file"
                    type="file"
                    name="file"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.target.files![0]) {
                        setIsFileSelected(true)
                      } else {
                        setIsFileSelected(false)
                      }
                    }}
                  />
                  {isFileSelected && <div className="file-pin"></div>}
                </label>
                <button className="sender__btn" type="submit"><i className="material-icons">message</i></button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <footer>footer</footer>
    </div>
  );
}

export default Chat