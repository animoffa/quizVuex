import Vue from "vue";

const usersStore = {
	namespaced: true,
	state: {
		usersList: {
			0: {
				name: "Vlad",
				result: "20",
			},
		},
	},
	getters: {
		users: ({ usersList }) => Object.values(usersList),
	},
	mutations: {
		ADD_USER(state, user) {
			Vue.set(state.usersList, user.id, user);
		},
	},
	actions: {
		addUser(context, user) {
			const newUser = {
				...user,
				id: String(Math.random()),
			};
			context.commit("ADD_USER", newUser);
		},
	},
};

export default usersStore;
