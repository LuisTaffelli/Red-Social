import axios from "axios";
import { ERROR } from "./Errors";

axios.defaults.withCredentials = true;

export const POST_CREATE = "POST_CREATE";
export const POST_LIKE = "POST_LIKE";
export const POST_SHARE = "POST_SHARE";
export const POST_COMMENT = "POST_COMMENT";
export const POST_DELETE = "POST_DELETE";
export const POST_UPDATE = "POST_UPDATE";
export const GET_POSTS = "GET_POSTS";
export const GET_POST_FOR_ID = "GET_POST_FOR_ID";
export const GET_POST_FOR_USERNAME = "GET_POST_FOR_USERNAME";
export const UPDATE_PAGE = "UPDATE_PAGE";
export const CLEAR_POST = "CLEAR_POST";
export const SET_TAGS = "SET_TAGS"
export const BANPOST_ADMIN =  "banPost_admin";
export const BANCOMMENT_ADMIN = "banComment_admin";
export const COMMENT_DELETE = "comment_delete"
// Crear Posteo
// return (dispatch) => axios.post('localhost:3001/post')
//  -> title
//  -> content
//  -> image
//  -> tag
//  -> username
//  -> likes = 0
// |-> tiene error
// |-> tiene success

// Posteos trae todo
//  -> ['', '', '', '']

// comentario devuelve el comentario creado

export function createPost(data, orden, tags) {
  return (dispatch) =>
    axios
      .post(`http://localhost:3001/post/?orden=${orden}&tags=${tags}`, data, { withCredentials: true })
      .then((res) => dispatch({ type: POST_CREATE, payload: res.data }))
      .catch((error) => dispatch({ type: ERROR, payload: error }));

  // return { type: POST_CREATE, payload: data };
}

export function deletePost(postId) {
  return (dispatch) =>
    axios
      .delete(`http://localhost:3001/post/${postId}`, { withCredentials: true })
      .then((res) => dispatch({ type: POST_DELETE, payload: res.data }))
      .catch((error) => dispatch({ type: ERROR, payload: error }));
}

export function updatePost(postId, data) {
  return (dispatch) =>
    axios
      .put(`http://localhost:3001/post/${postId}`, data, {
        withCredentials: true,
      })
      .then((res) => dispatch({ type: POST_UPDATE, payload: res.data }))
      .catch((error) => dispatch({ type: ERROR, payload: error }));

  //return { type: POST_UPDATE, payload: { postId } };
}

export function commentPost(postid, content, username, socket) {
  return (dispatch) =>
    axios
      .post(
        `http://localhost:3001/comment`,
        { postid, content, username },
        { withCredentials: true }
      )
      .then((res) => {
        socket.emit("reloadPostInfo", res.data);

        dispatch({
          type: POST_COMMENT,
          payload: res.data,
        });
      })
      .catch((error) => dispatch({ type: ERROR, payload: error }));

  //return { type: POST_COMMENT, payload: { idPost, text, user } };
}

export function getPosts(page, tag, orden) {
  return (dispatch) =>
    axios
      .get(`http://localhost:3001/post?page=${page}&tag=${tag}&orden=${orden}`)
      .then((res) => dispatch({ type: GET_POSTS, payload: res.data }))
      .catch((error) => dispatch({ type: ERROR, payload: error }));
}

export function getPostForId(id) {
  return (dispatch) =>
    axios
      .get(`localhost:3001/${id}`)
      .then((res) => dispatch({ type: GET_POST_FOR_ID, payload: res.data }))
      .catch((error) => dispatch({ type: ERROR, payload: error }));
}

export function getPostForUsername(username) {
  console.log("hola")
  return (dispatch) =>
    axios
      .get(`localhost:3001/`, username)
      .then((res) =>
        dispatch({ type: GET_POST_FOR_USERNAME, payload: res.data })
      )
      .catch((error) => dispatch({ type: ERROR, payload: error }));
}

export function updatePage(page) {
  return { type: UPDATE_PAGE, payload: page };
}

export function likePost(data, socket) {
  return (dispatch) =>
    axios
      .post("http://localhost:3001/likes", data, { withCredentials: true })
      .then((res) => {
        socket.emit("reloadPostInfo", res.data);

        dispatch({
          type: POST_LIKE,
          payload: res.data,
        });
      });
}

export function getTags(){
  return (dispatch) =>
    axios
      .get("http://localhost:3001/tags", { withCredentials: true })
      .then((res) => {console.log(res.data);
        dispatch({
          type: SET_TAGS,
          payload: res.data,
        });
      });
}

export function loadTags(){
  return (dispatch) =>
    axios
      .post("http://localhost:3001/tags", { withCredentials: true })
      .then((res) => {
        console.log(res.data)
      });
}
export function banPost(idPost){
  return (dispatch) =>
      axios
          .post(`http://localhost:3001/admin/banPost`, {idPost},{ withCredentials: true } )
          .then(res => dispatch({type: BANPOST_ADMIN, payload:res}) )
          .catch((e) =>(err) => dispatch({ type: ERROR, payload: err })
          )
}

export function banComment(idComent){
  return (dispatch) => {
    axios
      .post(`http://localhost:3001/admin/banComment`, {idComment:idComent},{withCredentials: true})
      .then(res => dispatch({type: BANCOMMENT_ADMIN, payload:res}) )
      .catch((e) =>(err) => dispatch({ type: ERROR, payload: err })
      )
  }
}


export function deleteComment(commentId) {
  return (dispatch) =>
    axios
      .delete(`http://localhost:3001/comment/${commentId}`, { withCredentials: true })
      .then((res) => dispatch({ type: COMMENT_DELETE, payload: res.data }))
      .catch((error) => dispatch({ type: ERROR, payload: error }));
}

/*
export function likePost(idPost, username) {
  return (dispatch) =>
    axios
      .post(
        `http://localhost:3001/likes`,
        { username, idPost },
        { withCredentials: true }
      )
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err.data));
}
export function clearPosts() {
  return { type: "CLEAR_POST", payload: [] };
}
export function getPostForId(id) {
  return (dispatch) =>
    axios
      .get(`localhost:3001/${id}`)
      .then((res) => dispatch({ type: GET_POST_FOR_ID, payload: res.data }));
}
export function getPostForUsername(username) {
  return (dispatch) =>
    axios
      .get(`localhost:3001/`, username)
      .then((res) =>
        dispatch({ type: GET_POST_FOR_USERNAME, payload: res.data })
      );
}
export function updatePage(bol, post){
  return ({type:UPDATE_PAGE, payload:{bol, post}})
}
/*
export function likePost(idPost, username) {
  return { type: POST_LIKE, payload: { idPost, username } };
}
export function sharePost(postId) {
  console.log(postId);
  return { type: POST_SHARE, payload: postId };
}
export function updatePost(postId, data) {
  console.log(postId, data);
  return { type: POST_UPDATE, payload: { postId } };
}
*/
