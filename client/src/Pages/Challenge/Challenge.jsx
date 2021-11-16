import CodeMirror from "@uiw/react-codemirror";
import "codemirror/theme/dracula.css";
import "codemirror/keymap/vim";
import "codemirror/keymap/sublime";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import styles from "./Challenge.module.css";
import Select from "react-select";
import "./Challenge.css";
import Post from "../../components/Post/Post";
import "./Popup.css";
import { socketConnection } from "../../Redux/actions/Users";
import { clearPosts, getPosts, updatePage } from "../../Redux/actions/Post";

export default function Challenge(props) {
  // Game
  const getNewVimTest = () => {
    const vimTest = "                                %\n";
    const emptyLine = "                                 \n";
    const vimTestLine = Math.floor(Math.random() * 10);
    let newVimTest = "";
    for (let i = 0; i < 10; i++) {
      if (i === vimTestLine) {
        newVimTest += vimTest;
      } else {
        newVimTest += emptyLine;
      }
    }
    return newVimTest;
  };

  const initialVimTest = getNewVimTest();
  const [/*vimTest, */ setVimTest] = useState(initialVimTest);
  const [victories, setVictories] = useState(0);
  const [game, setGame] = useState(false);

  // Challenge
  const [code, setCode] = useState("");
  const [testCases, setTestCases] = useState([]);
  const [inputs, setInputs] = useState([]);
  const posts = useSelector((state) => state.postsReducer.posts);
  const socket = useSelector((state) => state.usersReducer.socket);
  const session = useSelector((state) => state.sessionReducer);
  const dispatch = useDispatch();
  const [first, setFirst] = useState(true);

  const [page, totalPages] = useSelector(
    ({ postsReducer: { page, totalPages } }) => [page, totalPages]
  );

  // console.log(page)
  // console.log(totalPages)
  console.log(posts, "posts")


  useEffect(() => {
    if (page === -1) {
      window.scroll(0, 0);
      dispatch(updatePage(0));
      return;
    }
    dispatch(getPosts(page,"","cronologico"));
  }, [dispatch, page, first, totalPages]);

  // const submitCode = () => {
  //   axios
  //     .get("http://localhost:3001/challenge/comment/atalesam", {
  //       code,
  //       username: "atalesam",
  //       postid: 1,
  //       description: "asd",
  //     })
  //     .then(({ data }) => setTestCases([data.passOrFail]))
  //     .catch((e) => console.log(e));
  // };

  const submitCode = () => {
    // axios
    //   .get("http://localhost:3001/challenge/comment/atalesam", {
    //     code,
    //     username: "atalesam",
    //     postid: 1,
    //     description: "asd",
    //   })
    //   .then((res) => console.log(res))
    //   .catch((e) => console.log(e));
    console.log(posts);
  };

  const handleSelect = (e) => {
    if (e.value === "game") setGame(true);
    else setGame(false);
  };

  useEffect(() => {
    dispatch(socketConnection(session.username));
  }, []);

  return (
    <div className={styles.container}>
      {game ? (
        <div className="absolute left-20 right-20 top-20 bottom-20 text-left">
          <div>Move in the editor with 'h/j/k/l' delete with 'x'</div>
          <div>Won {victories} time(s)!</div>
          <CodeMirror
            options={{ theme: "dracula", mode: "js", keyMap: "vim" }}
            value={getNewVimTest()}
            height="200px"
            onChange={(editor, viewUpdate) => {
              if (editor.getValue().includes("%")) {
                console.log("value: ", editor.getValue());
                //
              } else {
                console.log("you won");
                setVimTest(getNewVimTest());
                setVictories(victories + 1);
              }
            }}
          />
        </div>
      ) : (
        <div className={styles.container}>
          {/* <Post
            post={{
              ban: false,
              comments: [],
              content: "Create a function that adds two numbers in JavaScript",
              createdAt: "2021-11-12T02:01:30.509Z",
              idPost: "3f02296d-4855-43a8-94e8-54a81f627b91",
              imageData: null,
              imageName: null,
              imageType: null,
              likes: null,
              tag: [null],
              title: "Challenge #1",
              updatedAt: "2021-11-12T02:01:31.313Z",
              user: { image: null, username: "jcapes29" },
              userId: "293fe521-68ce-4383-9ca6-1ca925eb7b3b",
              userLikes: [],
            }}
          /> */}
          {posts.map((post, i) => {
            if (post.type === "challenge")
              return (
                <li key={i}>
                  <Post post={post} socket={socket} user={session.username} />
                </li>
              );
          })}
        </div>
      )}
      {/* <Select
        onChange={handleSelect}
        options={[
          { value: "challenge", label: "Challenge" },
          { value: "game", label: "Game" },
        ]}
      /> */}
    </div>
  );
}
