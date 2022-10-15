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
  TOGGLE_IS_LOGGED: "TOGGLE_IS_LOGGED",
  GET_USER_INFO: "GET_USER_INFO",
  LOG_OUT: "LOG_OUT",
  CLOSE_POP_WINDOW: "CLOSE_POP_WINDOW",
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

const authReducer = (state: State, action: any) => {
  switch (action.type) {
    case actionType.TOGGLE_LOGIN:
      return { ...state, login: !state.login };
    case actionType.TOGGLE_REGISTER:
      return { ...state, register: !state.register };
    case actionType.TOGGLE_IS_LOGGED:
      return { ...state, isLogged: !state.isLogged };
    case actionType.GET_USER_INFO:
      return {
        ...state,
        userAvatar: action.payload.user_avatar,
        userEmail: action.payload.user_email,
        userId: action.payload.user_id,
        userName: action.payload.user_name,
      };
    case actionType.LOG_OUT:
      return {
        login: false,
        register: false,
        isLogged: false,
        userAvatar: "",
        userEmail: "",
        userId: "",
        userName: "",
      };
    case actionType.CLOSE_POP_WINDOW:
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
