export function supportReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_THEME_MODE":
      return {
        ...state,
        themeMode: state.themeMode === "dark" ? "light" : "dark",
      };
    case "TOGGLE_DRAWER_MODE":
      return {
        ...state,
        drawerOpen: !state.drawerOpen,
      };
    case "SET_CONVERSATION_LIST":
      return {
        ...state,
        conversationList: Array.isArray(action.payload)
          ? action.payload
          : [...state.conversationList, ...action.payload],
      };
    case "SET_CONVERSATION_LOADING":
      return {
        ...state,
        productLoading: action.payload,
      };
    default:
      return state;
  }
}
