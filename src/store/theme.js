const usersStore = {
	namespaced: true,
	state: {
		darkTheme: false,
	},
	getters: {
		theme: ({ darkTheme }) => (darkTheme),
	},
	mutations: {
		CHANGE_THEME(state) {
			state.darkTheme = !state.darkTheme;
		},
	},
	actions: {
		changeTheme({ commit }) {
			commit("CHANGE_THEME");
		},
	},
};

export default usersStore;
