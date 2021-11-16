import Conversation from "../../components/Conversations/Conversations.jsx";
import Message from "../../components/Message/Message.jsx";
import ChatOnline from "../../components/ChatOnline/ChatOnline.jsx";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socketConnection } from "../../Redux/actions/Users";

import axios from "axios";

import styles from "./Messenger.module.css";

export default function Messenger() {
  const user = useSelector((store) => store.sessionReducer);
  const socket = useSelector((state) => state.usersReducer.socket);

  const dispatch = useDispatch();

  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers] = useState([]);
  const scrollRef = useRef();

  useEffect(() => {
    if (!Object.keys(socket).length) {
      dispatch(socketConnection(user.username));
    }
  }, [dispatch, socket, user.username]);

  useEffect(() => {
    if (Object.keys(socket).length) {
      socket.on("getMessage", (data) => {
        setArrivalMessage({
          sender: data.senderId,
          text: data.text,
          createdAt: Date.now(),
        });
      });
    }
  }, [socket]);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    if (Object.keys(socket).length) {
      socket.on("getUsers", (users) => {
        console.log(users);
        // setOnlineUsers(
        //   user.followings.filter((f) => users.some((u) => u.userId === f))
        // );
      });
    }
  }, [socket, user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/conversation/" + user.username
        );
        console.log(res.data);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user.username]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        //console.log(currentChat.id);
        const res = await axios.get(
          "http://localhost:3001/message/" + currentChat?.id
        );
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user.username,
      text: newMessage,
      conversationId: currentChat.id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user.username
    );

    socket.emit("sendMessage", {
      senderId: user.username,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post("http://localhost:3001/message/", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className={styles.messenger}>
        <div className={styles.chatMenu}>
          <div className={styles.chatMenuWrapper}>
            <input
              placeholder="Search for friends"
              className={styles.chatMenuInput}
            />
            {conversations.map((c) => (
              <div onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.chatBox}>
          <div className={styles.chatBoxWrapper}>
            {currentChat ? (
              <>
                <div className={styles.chatBoxTop}>
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message message={m} own={m.sender === user.username} />
                    </div>
                  ))}
                </div>
                <div className={styles.chatBoxBottom}>
                  <textarea
                    className={styles.chatMessageInput}
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button
                    className={styles.chatSubmitButton}
                    onClick={handleSubmit}
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className={styles.noConversationText}>
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className={styles.chatOnline}>
          <div className={styles.chatOnlineWrapper}>
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user.username}
              setCurrentChat={setCurrentChat}
            />
          </div>
        </div>
      </div>
    </>
  );
}
