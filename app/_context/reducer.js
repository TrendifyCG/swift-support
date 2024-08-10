export function supportReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_THEME_MODE":
      return {
        ...state,
        themeMode: state.themeMode === "dark" ? "light" : "dark",
      };
    default:
      return state;
  }
}
