import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [conversation, setConversation] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [receiver, setReceiver] = useState({});
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [surname, setSurname] = useState("");
  useEffect(() => {
    if (user.user_id) {
      getUsers();
    }
  }, [user]);

  useEffect(() => {
    if (user.user_id && receiver.user_id) {
      getConversation();
    }
  }, [receiver]);
  const submitHandler = (e) => {
    const formData = new FormData();
    formData.append("action", "get-user");
    formData.append("name", name);
    formData.append("surname", surname);
    e.preventDefault();
    fetch("http://localhost/chat/index.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setUser(response);
      });
  };
  const messageHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("sender_id", user.user_id);
    formData.append("receiver_id", receiver.user_id);
    formData.append("message", message);
    formData.append("action", "add-message");
    fetch("http://localhost/chat/index.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => {
        setConversation(response);
      });
    setMessage("");
  };
  const getUsers = () => {
    const formData = new FormData();
    formData.append("action", "get-users");
    formData.append("user_id", user.user_id);
    fetch("http://localhost/chat/index.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => setUsers(response))
      .catch((err) => console.error(err));
  };
  const getConversation = () => {
    setConversation([]);
    const formData = new FormData();
    formData.append("action", "get-conversation");
    formData.append("sender_id", user.user_id);
    formData.append("receiver_id", receiver.user_id);
    fetch("http://localhost/chat/index.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setConversation(response);
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      {user.user_id ? (
        <>
          <div className="all-users flex flex-col cursor-pointer">
            {users?.map((user, index) => {
              return (
                <h3
                  key={index}
                  onClick={() => {
                    setReceiver(user);
                  }}
                  className={`user-${user.user_name} bg-red-300 transition duration-300 hover:bg-red-500 p-3 rounded-md inline-block m-3 text-white `}
                >
                  {user.user_name}
                </h3>
              );
            })}
          </div>
          <div className="chat flex flex-col items-center justify-center">
            <div className="chat-owners">
              {receiver.user_name ? (
                <h1 className="bg-green-300  p-3 rounded-md inline-block m-3 text-white">
                  {receiver.user_name}
                </h1>
              ) : null}

              <h1 className="bg-yellow-300  p-3 rounded-md inline-block m-3 text-white">
                {user.user_name}
              </h1>
            </div>
            <div className="chat-area">
              {receiver.user_id ? (
                <div className="border border-black w-[300px] h-[300px] select-none resize-none">
                  {conversation !== "sohbet bulunamadı" ? (
                    conversation.map((message, index) => {
                      return (
                        <h3
                          title={message.chat_date}
                          className={
                            message.sender_id === user.user_id
                              ? "bg-yellow-300 p-1 border border-white flex justify-end gap-x-1 items-center w-full "
                              : "bg-green-300 p-1 border border-white flex justify-start gap-x-1 ml-auto w-full"
                          }
                          key={index}
                        >
                          {message.chat_message}
                        </h3>
                      );
                    })
                  ) : (
                    <div>
                      Kullanıcı ile bir mesaj geçmişiniz bulunmuyor merhaba
                      deyin.
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center border border-black whitespace-pre-wrap">
                  sohbeti baslatmak ıcın bır kullanıcı secın
                </div>
              )}
            </div>
            <form onSubmit={messageHandler}>
              <input
                disabled={!receiver.user_id}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border border-black py-3"
                placeholder="enter your message"
                type="text"
              ></input>
              <button
                className={`${
                  receiver.user_id
                    ? " bg-green-500 p-3 rounded-md btn-success"
                    : " bg-green-200 hover:bg-green-200 p-3 rounded-md btn-success"
                }`}
                type="submit"
              >
                send
              </button>
            </form>
          </div>
        </>
      ) : (
        <form onSubmit={(e) => submitHandler(e)} className="w-[30%]">
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Surname</label>
            <input
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              type="text"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="surname"
            />
          </div>

          <button type="submit" className="btn btn-primary bg-blue-700">
            Log in
          </button>
        </form>
      )}
    </>
  );
}

export default App;
