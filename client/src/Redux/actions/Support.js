import axios from "axios";
import { ERROR } from "./Errors";
export const GET_SUPPORT_MESSAGE = "get_support_message"
export const DELETE_MESSAGE_SUPPORT = "DELETE_MESSAGE_SUPPORT"

export function createSupport(payload) {
  return (dispatch) =>
    axios
      .post("http://localhost:3001/support", payload,{
        withCredentials: true,
      })
      .then((res) => dispatch({ payload: res }))
      .catch((err) => dispatch({ type: ERROR, payload: err }));
}

export function getSupport(){
    return (dispatch) =>
    axios
      .get(`http://localhost:3001/support`,{
        withCredentials: true,
      })
      .then((res) => dispatch({ type: GET_SUPPORT_MESSAGE, payload: res.data } ));
     
}

export function creatReport(data){
  return (dispatch) => 
    axios
      .post(`http://localhost:3001/support`,data,{ withCredentials: true } )
      .then((res) => dispatch({ payload: res }))
      .catch((err) => dispatch({ type: ERROR, payload: err }));
  
}

export function deleteMessageSupport(id){
  return (dispatch) =>
    axios 
      .delete(`http://localhost:3001/support/${id}`,{ withCredentials: true })
      .then((res) => dispatch({ type: DELETE_MESSAGE_SUPPORT ,payload: res }))
      .catch((err) => dispatch({ type: ERROR, payload: err }));
}