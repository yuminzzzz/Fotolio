export const authInitState = {
  login: false,
  register: false,
  isLogged: false,
  userAvatar: "",
  userEmail: "",
  userId: "",
  userName: "",
};

const actionType = {
  TOGGLE_LOGIN: "TOGGLE_LOGIN",
  TOGGLE_REGISTER: "TOGGLE_REGISTER",
  TOGGLE_ISLOGGED: "TOGGLE_ISLOGGED",
  GET_USER_INFO: "GET_USER_INFO",
  LOGOUT: "LOGOUT",
  CLOSE_POPWINDOW: "CLOSE_POPWINDOW",
};

type State = {
  login: boolean;
  register: boolean;
  isLogged: boolean;
  userAvatar: string;
  userEmail: string;
  userId: string;
  userName: string;
};

// type Action = {
//   type: {
//     ACTIONTYPE: {
//       TOGGLE_LOGIN: string;
//       TOGGLE_REGISTER: string;
//       TOGGLE_ISLOGGED: string;
//       GET_USER_INFO: string;
//     };
//   };
//   payload: {
//     user_avatar: string;
//     user_email: string;
//     user_id: string;
//     user_name: string;
//   };
// };

const authReducer = (state: State, action: any) => {
  switch (action.type) {
    case actionType.TOGGLE_LOGIN:
      return { ...state, login: !state.login };
    case actionType.TOGGLE_REGISTER:
      return { ...state, register: !state.register };
    case actionType.TOGGLE_ISLOGGED:
      return { ...state, isLogged: !state.isLogged };
    case actionType.GET_USER_INFO:
      return {
        ...state,
        userAvatar: action.payload.user_avatar,
        userEmail: action.payload.user_email,
        userId: action.payload.user_id,
        userName: action.payload.user_name,
      };
    case actionType.LOGOUT:
      return {
        login: false,
        register: false,
        isLogged: false,
        userAvatar: "",
        userEmail: "",
        userId: "",
        userName: "",
      };
    case actionType.CLOSE_POPWINDOW:
      return {
        ...state,
        login: false,
        register: false,
      };
    default:
      return state;
  }
};

export default authReducer;
