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
    default:
      return state;
  }
}
