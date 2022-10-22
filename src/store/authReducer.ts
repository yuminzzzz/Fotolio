export enum AuthActionKind {
  TOGGLE_LOGIN = "TOGGLE_LOGIN",
  TOGGLE_REGISTER = "TOGGLE_REGISTER",
  TOGGLE_IS_LOGGED = "TOGGLE_IS_LOGGED",
  GET_USER_INFO = "GET_USER_INFO",
  LOG_OUT = "LOG_OUT",
  CLOSE_POP_WINDOW = "CLOSE_POP_WINDOW",
}

export interface AuthState {
  login: boolean;
  register: boolean;
  isLogged: boolean;
  userAvatar: string;
  userEmail: string;
  userId: string;
  userName: string;
}

export interface AuthAction {
  type: AuthActionKind;
  payload?: {
    user_avatar: string;
    user_email: string;
    user_id: string;
    user_name: string;
  };
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AuthActionKind.TOGGLE_LOGIN:
      return { ...state, login: !state.login };
    case AuthActionKind.TOGGLE_REGISTER:
      return { ...state, register: !state.register };
    case AuthActionKind.TOGGLE_IS_LOGGED:
      return { ...state, isLogged: true };
    case AuthActionKind.GET_USER_INFO:
      return {
        ...state,
        userAvatar: action.payload!.user_avatar,
        userEmail: action.payload!.user_email,
        userId: action.payload!.user_id,
        userName: action.payload!.user_name,
      };
    case AuthActionKind.LOG_OUT:
      return {
        login: false,
        register: false,
        isLogged: false,
        userAvatar: "",
        userEmail: "",
        userId: "",
        userName: "",
      };
    case AuthActionKind.CLOSE_POP_WINDOW:
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
