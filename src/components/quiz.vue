<template>
    <div v-if="show" class="modal-shadow " @click.self="closeModal">
        <div class="modal wrapper ">
            <div id="quiz" class="quiz ">
                <div v-if="!resShow" class="slider-container">
                    <div id="questions" class="quiz-questions  slider-track">
                        <div v-for="(question,i) in DATA" :key="i" class="quiz-questions-item">
                            <div class="quiz-questions-item__question">{{question.question}}</div>
                            <div class="quiz-questions-item__answers">
                                <ul>
                                    <li v-for="answer of question.answers" :key="answer.id">
                                        <label>
                                            <input v-model="results[QuestionIndex]"
                                                   :type="question.type"
                                                   :name="QuestionIndex"
                                                   :value="answer.id"
                                                   class="answer-input"/>
                                            {{question.type==="radio"?answer.value:null}}
                                        </label>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else id="results" class="quiz-results ">
                    <strong class="">{{results[0]}},вы прошли тест на:<span
                            :class="{wrongAnswer:k<40, rightAnswer:k>60}">{{k.toFixed(2)}}%</span></strong>
                    <div v-for="(res,i) in DATA" :key="i" class="quiz-results-item">
                        <strong class="quiz-results-item__question">{{res.question}}</strong>
                        <div class="quiz-results-item__answers">
                            <ul>
                                <li v-for="answer of res.answers" :key="answer.id">
                                    <label v-if="res.type==='radio'" class="answer"
                                           :class="{ wrongAnswer: answer.id === results[res.id] && answer.correct === false,
					rightAnswer: answer.correct === true}">
                                        {{answer.id===results[res.id]?
                                        answer.value +"Ваш ответ"
                                        : answer.value}}
                                    </label>
                                    <label v-else class="answer"
                                           :class="{ wrongAnswer: answer.value.toUpperCase() !== results[res.id].toUpperCase(),
					rightAnswer: answer.value.toUpperCase() === results[res.id].toUpperCase() }">
                                        Ваш ответ:{{answer.value}}
                                    </label>

                                </li>

                            </ul>
                        </div>
                    </div>
                </div>

                <div v-if="!resShow" id="indicator" class="quiz-indicator">{{QuestionIndex+1}}/{{DATA.length}}</div>
                <div class="quiz-controls">
                    <button v-if="!resShow" id="btn-next" class="btn-next" @click="formClick">
                        Далее
                    </button>
                    <button v-else id="btn-restart" class="btn-restart" @click="saveUserResult">Сохранить</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

	import Questions from "../../questions.json"

	export default {
		components: {},

		props: {
			addUserFormShow: {
				type: Boolean,
			}
		},
		data() {
			return {
				wrongAnswer: false,
				wightAnswer: false,
				resShow: false,
				results: {},
				position: 0,
				DATA: Questions,
				QuestionIndex: 0,
				show: true,
				k: 0
			}
		},
		methods: {
			formClick() {
				if (this.DATA.length !== this.QuestionIndex + 1) {
					if (this.results[this.QuestionIndex]) {
						this.QuestionIndex = this.QuestionIndex + 1;
						let itemWidth = document.querySelector(".quiz").clientWidth
						let itemsLeft = this.DATA.length - (Math.abs(this.position) + itemWidth) / itemWidth;
						this.position -= itemsLeft >= 1 ? itemWidth : itemsLeft * itemWidth;
						document.querySelector(".slider-track").style.transform = `translateX(${this.position}px)`;
					} else {
						alert("Заполните форму");
					}
				} else {
					if (this.results[this.QuestionIndex]) {

						this.summaryResult();
						this.DATA.shift()
						console.log(this.results)
						this.resShow = true;

					} else {
						alert("Заполните форму");
					}
				}
			},
			summaryResult() {
				this.DATA.forEach((question) => {

					if (question.type === "radio") {
						question.answers.forEach((answer) => {
							if (answer.id === this.results[question.id] && answer.correct === true) {
								this.k = this.k + 1
							}
						})
					} else {
						if (question.id !== 0) {
							if (question.answers[0].value.toUpperCase() === this.results[question.id].toUpperCase()) {
								this.k = this.k + 1
							}
						}
					}
				})

				this.k = this.k / (this.DATA.length - 1) * 100;
				this.k.toFixed(2);
			},

			closeModal() {
				this.show = false;
				this.DATA.unshift({
					"question": "Введите ваше имя",
					"id": 0,
					"type": "text",
					"answers": [
						{
							"id": "1"
						}
					]
				});
				window.document.body.classList.remove("modal-active");
				this.$emit("form-close");
			},
			saveUserResult() {
				this.$emit("save-user-result", this.results[0], this.k.toFixed(2));
				this.closeModal();
			}

		}
	}


</script>

<style scoped lang="less">
    @import "../assets/mixins.less";

    .modal-active {
        overflow: hidden;
    }

    .slider-container {
        overflow: hidden;

    }

    .slider-track {
        display: flex;

        transition: 2s;
    }

    .modal-title {
        font-size: 2.4rem;
        margin-bottom: 5rem;
    }


    .modal-shadow {
        position: fixed;
        top: 0;
        left: 0;
        min-height: 100%;
        width: 100%;
        background: rgba(0, 0, 0, 0.39);
    }

    .modal {
        background: #fff;
        border-radius: 8px;
        padding: 2rem 0;
        width: 50%;
        position: fixed;
        left: 50%;
        transform: translate(-50%, -50%);
        top: 50%;
        max-height: 85%;
        overflow: auto;
    }

    .darkMode {
        .modal {
            background-color: @black;
        }

    }

    .quiz-questions {
        display: flex;
    }

    .quiz {
        margin: 0 auto;
        width: 60rem;

        &-indicator, &-results {
            margin-bottom: 2rem;
        }

        &-questions, &-results {
            margin-bottom: 2rem;

            &-item {
                margin-bottom: 1rem;
                width: 100%;
                min-width: 100%;

                &__question {
                    font-size: 2.3rem;
                    margin-bottom: 2rem;
                }

                &__answers {
                    margin: 0;
                    font-size: 2rem;
                    padding: 0;
                    list-style: none;
                }

            }
        }

        .wrongAnswer {
            color: red;
        }

        .rightAnswer {
            color: green;
        }

        label {

            word-break: break-all;
        }

        li {
            list-style: none;
        }

    }
</style>