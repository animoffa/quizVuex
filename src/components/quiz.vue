<template>
    <div v-if="show" class="modal-shadow">
        <div class="modal wrapper ">
            <div id="quiz" class="quiz ">
                <div v-if="!resShow" id="indicator" class="quiz-indicator">
                    <span class="step">Шаг {{QuestionIndex+1}} из {{DATA.length}}</span>
                    <div class="empty-indicator" :style="{width: DATA.length*6.3+ 'rem'}">
                        <div class="full-indicator" :style="{width: (QuestionIndex+1)*6.3+ 'rem'}"></div>
                    </div>
                </div>
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
                <div v-else id="results" class="quiz-results">
                    <strong class="result">{{results[0]}}, вы прошли тест на: <span
                            :class="{wrongAnswer:k<40, rightAnswer:k>60}">{{k.toFixed(2)}}%</span></strong>
                    <div v-for="(res,i) in DATA" :key="i" class="quiz-results-item">
                        <p class="quiz-results-item__question">{{res.question}}</p>
                        <div class="quiz-results-item__answers">
                            <ul>
                                <li v-for="answer of res.answers" :key="answer.id">
                                    <label v-if="res.type==='radio'" class="answer"
                                           :class="{ wrongAnswer: answer.id === results[res.id] && answer.correct === false,
					rightAnswer: answer.correct === true}">
                                        {{answer.id===results[res.id]?
                                        answer.value +" - Ваш ответ"
                                        : answer.value}}
                                    </label>
                                    <label v-else class="answer"
                                           :class="{ wrongAnswer: answer.value.toUpperCase() !== results[res.id].toUpperCase(),
					rightAnswer: answer.value.toUpperCase() === results[res.id].toUpperCase() }">
                                        Ваш ответ: {{answer.value}}
                                    </label>

                                </li>

                            </ul>
                        </div>
                    </div>
                </div>

                <div class="quiz-controls">
                    <button v-if="!resShow" id="btn-next" class="btn-next" @click="formClick">
                        Далее
                    </button>
                    <button v-else id="btn-restart" class="btn-save" @click="saveUserResult">Сохранить</button>
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

        transition: 1.5s;
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
        border-radius: 1.5rem;
        padding: 4rem 0;
        width: 48%;
        position: fixed;
        left: 50%;
        transform: translate(-50%, -50%);
        top: 50%;
        height: 60rem;
        max-height: 95%;
        overflow: auto;
    }


    .quiz-questions {
        display: flex;
    }

    .quiz {
        margin: 0 auto;
        width: 91.5%;

        &-indicator, &-results {
            margin-bottom: 5rem;
        }

        &-questions, &-results {
            margin-bottom: 2rem;

            &-item {
                margin-bottom: 1rem;
                width: 100%;
                min-width: 100%;

                &__question {
                    font-weight: 600;
                    font-size: 1.8rem;
                    text-align: left;
                    margin-bottom: 3rem;
                }

                &__answers {
                    margin: 0;
                    font-size: 2rem;
                    padding: 0;
                    list-style: none;
                    display: flex;
                    align-items: baseline;
                    flex-direction: column;
                }

            }
        }

        .wrongAnswer {
            color: red;
        }

        .rightAnswer {
            color: green;
        }

        .quiz-controls {
            display: flex;
            justify-content: flex-end;
        }


        ul {
            padding: 0;
        }

        li {
            list-style: none;
            text-align: initial;
        }

        input {
            width: 41rem;
            border: none;
            font-size: 1.5rem;
            border-bottom: 0.5px solid #838383;
        }

        label {
            white-space: normal;
            font-size: 1.5rem;
        }

        .btn-next {
            background: #2C98F0;
            position: absolute;
            top: 86%;
        }

        .btn-save {
            border: 2px solid #62b7fb;
            background: transparent;
            color: #62b7fb;
            font-weight: 600;
        }

        input[type="radio"] {
            width: 3rem;
        }
    }

    .step {
        font-weight: 600;
        font-size: 2.5rem;
    }

    #indicator {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .empty-indicator {
        height: 1rem;
        background: #F1F1F1;
        border-radius: 100px;
    }

    .full-indicator {
        background: #2C98F0;
        border-radius: 100px;
        height: 1rem;
        transition: 1s;
    }

    .answer {
        list-style: circle;
        margin-bottom: 1rem;
    }

    .result {
        margin-bottom: 3rem;
    }

    .quiz-results-item {
        margin-top: 3rem;

        &__question {
            margin-bottom: 1rem;
        }
    }

    .darkMode {
        .modal {
            background-color: @black;
        }

        input {
            background: transparent;
            color: white;
        }

        .empty-indicator {
            background: #5f5f5f;
        }
    }
</style>