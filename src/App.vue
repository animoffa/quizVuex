<template>
    <div id="app" class="app">
        <div class="theme-changer">
            <p>Dark theme</p>
            <label class="switch">
                <input type="checkbox" @click="change">
                <span class="slider round"></span>
            </label>
        </div>

        <h1>Пользователи</h1>
        <div class="user-container">
            <div v-for="(user, i) in users" :key="i" class="user">
                <p>{{ user.name }}</p>
                <p>{{user.result}}%</p>
            </div>
        </div>

        <button class="button" @click="openModal">Добавить</button>
        <template v-if="addUserFormShow">
            <quiz :add-user-form-show="addUserFormShow" @form-close="formClose" @save-user-result="addUserResult"/>
        </template>
    </div>
</template>

<script>
	import { mapActions, mapGetters } from "vuex";
	import quiz from "@/components/quiz.vue"

	export default {
		name: "App",
		components: { quiz },
		data() {
			return {
				addUserFormShow: false
			}
		},
		computed: {
			...mapGetters("users", ["users"]),
			...mapGetters("theme", ["theme"])
		},
		methods: {
			...mapActions("users", ["addUser"]),
			...mapActions("theme", ["changeTheme"]),
			openModal() {
				this.addUserFormShow = true;
			},
			addUserResult(name, result) {
				const newUser = {
					name,
					result,
				};
				this.addUser(newUser);
			},
			change() {
				this.changeTheme();
				console.log(document);
				this.theme ? document.body.classList.add("darkMode") : document.body.classList.remove("darkMode");
			},
			formClose() {
				this.addUserFormShow = false;
			}
		},
	};
</script>

<style lang="less">
    @import "assets/mixins.less";

    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        margin-top: 200px;
        width: 100%;
        height: 100%;
    }

    .user-container {
        display: flex;
        overflow: auto;
        width: 90%;
        margin: 6rem 0 0 0;
        left: 5%;
        position: relative;
        justify-content: center;

        .user {
            border-radius: 2rem;
            margin: 1rem;
            padding: 1rem 2rem;
            border: 0.1rem solid @black;
        }
    }

    .button {
        margin: 4rem;
        background: @buttonFace;
        border-radius: 1rem;
        font-size: 1.9rem;
        padding: 1rem 2rem;
        border: none;
        color: @buttonText;
    }

    ::-webkit-scrollbar {
        width: 7px;
        height: 7px; /* высота для горизонтального скролла */
        background-color: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #ccc;
        border-radius: 9em;
        box-shadow: inset 1px 1px 10px rgba(55, 55, 55, 10%);
    }

    ::-webkit-scrollbar-thumb:hover {
        background-color: white;
    }


    .switch {
        position: relative;
        display: inline-block;
        width: 6rem;
        height: 3.4rem;
    }

    .switch input {
        display: none;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 2.6rem;
        width: 2.6rem;
        left: 0.4rem;
        bottom: 0.4rem;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
    }

    input:checked + .slider {
        background-color: #2196F3;
    }

    input:focus + .slider {
        box-shadow: 0 0 1px #2196F3;
    }

    input:checked + .slider:before {
        -webkit-transform: translateX(2.6rem);
        -ms-transform: translateX(2.6rem);
        transform: translateX(2.6rem);
    }

    .slider.round {
        border-radius: 3.4rem;
    }

    .slider.round:before {
        border-radius: 50%;
    }

    .app {
        color: @black;
    }

    .darkMode {
        color: @white;
        background: @black;

        .app {
            color: @white;
        }

        .user {
            border: 0.1rem solid @white;
        }

        .button {
            background: darken(@buttonFace, 10%);
        }

    }

    .theme-changer {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 1rem;
        right: 2rem;

        p {
            font-weight: bold;
            margin-right: 1rem;
            font-size: 1.9rem;
        }
    }

    html {
        font-family: "Gilroy", sans-serif;
        font-size: 62.5%;
        font-style: normal;
        font-weight: 500;
        -webkit-animation: bugfix infinite 1s;
        line-height: 1.2;
        margin: 0;
        padding: 0;
        height: 100%;
    }

    * {
        font-size: 2.2rem;
        box-sizing: border-box;
        line-height: 3rem;
    }


    button,
    input,
    a,
    textarea {
        outline: none;
        cursor: pointer;
    }

    button:focus,
    input:focus,
    a:focus,
    textarea:focus {
        outline: none;
    }

    button:active,
    input:active,
    a:active,
    textarea:active {
        outline: none;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        display: block;
        padding: 0;
    }

    h1 {
        font-family: serif;
        font-size: 4rem;
        margin-bottom: 0.5rem;

        @media (max-width: 768px) {
            font-size: 4.5rem;
            margin-top: 7rem;
        }

    }

    .h1,
    .h2,
    .h3,
    .h4,
    .h5,
    .h6 {
        display: block;
        padding: 0;
    }

    .container {
        width: 160rem;
        margin: 0 auto;
        position: relative;
        max-width: 100%;
        padding: 0 1% 0 4%;
    }

    .hidden {
        overflow: hidden;
    }

    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    input[type=number] {
        -moz-appearance: textfield;
    }

    @media (max-width: 112em) {
        html {
            font-size: 9px;
        }
    }

    @media (max-width: 105em) {
        html {
            font-size: 8.75px;
        }
    }

    @media (max-width: 91.5em) {
        html {
            font-size: 7.9px;
        }
    }

    @media (max-width: 91em) {
        html {
            font-size: 8.4px;
        }
    }

    @media (max-width: 90em) {
        html {
            font-size: 7.9px;
        }
    }

    @media (max-width: 80em) {
        html {
            font-size: 7.2px;
        }
    }

    @media (max-width: 72em) {
        html {
            font-size: 6.5px;
        }
    }

    @media (max-width: 64em) {
        html {
            font-size: 5.5px;
        }
    }

    @media (max-width: 48em) {
        html {
            font-size: 10px;
            -webkit-text-size-adjust: none;
        }

        .mobile {
            display: block;
        }

        .container {
            margin: 0 auto;
            width: auto;
        }

        .button img {
            width: 10.2rem;
            padding-right: 3rem;
        }

    }

    @media (max-width: 44em) {
        html {
            font-size: 9px;
        }
    }

    @media (max-width: 38em) {
        html {
            font-size: 8px;
        }
    }

    @media (max-width: 34em) {
        html {
            font-size: 7px;
        }
    }

    @media (max-width: 30em) {
        html {
            font-size: 6px;
        }
    }

    @media (max-width: 26em) {
        html {
            font-size: 5.1px;
        }
    }

    @media (max-width: 22.5em) {
        html {
            font-size: 4.5px;
        }
    }

    @media (max-width: 21em) {
        html {
            font-size: 4.4px;
        }
    }
</style>
