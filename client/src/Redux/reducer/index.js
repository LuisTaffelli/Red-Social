//const initialState = {}

import { combineReducers } from "redux";

import postsReducer from "./posts.js";

import sessionReducer from "./session.js";

import usersReducer from "./users.js";

import errorsReducer from "./errors.js";

import adminReducer from "./admin.js";

import supportReducer from "./support.js";

import themeReducer from "./theme.js";

export default combineReducers({
  postsReducer, // Array con todos los posteos / filtrar posteos - busqueda - ordernar
  sessionReducer, // Objeto Datos del usuario logeado / login - logout - register
  usersReducer, // Array con todos los usuarios / Filtrar usuarios - busqueda - ordenar
  errorsReducer, // Contiene los errores de todos los reducers
  adminReducer, //Objeto con todos los mesajes para el admin
  supportReducer, // Objeto que guarda todos los mesajes de usuarios para el support
  themeReducer, // Maneja el tema actual de la aplicacion
});
