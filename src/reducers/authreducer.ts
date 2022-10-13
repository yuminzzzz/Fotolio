export const initialState = {
  login: false,
  register: false,
  isLogged: null,
  userAvatar: "",
  userEmail: "",
  userId: "",
  userName: "",
};

const ACTIONTYPE = {
  TOGGLE_LOGIN: "TOGGLE_LOGIN",
  TOGGLE_REGISTER: "TOGGLE_REGISTER",
  TOGGLE_ISLOGGED: "TOGGLE_ISLOGGED",
  GET_USER_INFO: "GET_USER_INFO",
};

type State = {
  login: boolean;
  register: boolean;
  isLogged: null | boolean;
  userAvatar: string;
  userEmail: string;
  userId: string;
  userName: string;
};

const authReducer = (state: State, action: { type: string }) => {
  switch (action.type) {
    case ACTIONTYPE.TOGGLE_LOGIN:
      return { ...state, login: !state.login };
    case ACTIONTYPE.TOGGLE_REGISTER:
      return { ...state, register: !state.register };
    case ACTIONTYPE.TOGGLE_ISLOGGED:
      return { ...state, isLogged: !state.isLogged };
    case ACTIONTYPE.GET_USER_INFO:
      return {
        ...state,
        userAvatar: action.payload.user_avatar,
        userEmail: action.payload.user_email,
        userId: action.payload.user_id,
        userName: action.payload.user_name,
      };
    default:
      return state;
  }
};
