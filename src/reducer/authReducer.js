export const authReducer = (state, action) => {
  const { type, payload } = action;
  const { authLoading, isAuthenticated, user, users } = payload;
  switch (type) {
    case "SET_AUTH":
      return {
        ...state,
        authLoading,
        isAuthenticated,
        user,
      };
    case "SET_USERS":
      return {
        ...state,
        users,
      };
    case "DELETE_USERS":
      return {
        ...state,
        users: users,
      };
    case "SET_LOADING":
      return {
        ...state,
        authLoading: payload,
      };
    default:
      return state;
  }
};
