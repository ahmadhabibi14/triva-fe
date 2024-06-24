<script lang="ts">
    import { Icon } from "svelte-icons-pack";
    import InputBox from "../../lib/InputBox.svelte";
    import { FaTrashCan } from "svelte-icons-pack/fa";
    import { BiPlus } from "svelte-icons-pack/bi";
    import type { QuizChoice, QuizQuestion } from "../../types/quiz";
    import toast, { Toaster } from "svelte-french-toast";
    import axios from "axios";
    import type { HTTPResponse } from "@/types/http";
    import { onMount } from "svelte";

    export let params: { id: string };

    let questions: QuizQuestion[] = [];
    let question: QuizQuestion = {
        id: 0,
        name: "",
        choices: [
            { id: randomblob(5), name: "", correct: false },
            { id: randomblob(5), name: "", correct: false },
            { id: randomblob(5), name: "", correct: false },
        ],
    };
    let isAdded: boolean = false;

    //fetching questions with quiz id
    onMount(() => {
        const url: string = import.meta.env.VITE_WEB_HOST + "/quiz/questions";
        axios
            .get(url, {
                headers: {
                    "Content-Type": "application/json",
                    "X-API-KEY": localStorage.getItem("session_id"),
                },
                params: { quiz_id: params.id },
            })
            .then((resp) => {
                const body: HTTPResponse = resp.data as HTTPResponse;
                const out: QuizQuestion[] = body.data as QuizQuestion[];
                questions = out;
                console.log(out);
            })
            .catch((err) => {
                const body: HTTPResponse = err.response.data as HTTPResponse;
                toast.error(body.errors);
                console.log(err);
            });
    });

    function randomblob(length: number): number {
        return Math.floor(Math.random() * Math.pow(10, length));
    }

    async function Addquestion() {
        if (question.name === "") {
            toast.error("Enter Question ...");
            return;
        }
        if (question.choices.length < 2) {
            toast.error("Enter atleat more than 2 choices");
            return;
        }
        let checked = false;
        for (const choice of question.choices) {
            if (choice.name === "") {
                toast.error("Choice can't be empty");
                return;
            }
            if (choice.correct) checked = true;
        }
        if (!checked) {
            toast.error("Check atleat one option");
            return;
        }

        //make request
        isAdded = true;

        const url: string =
            import.meta.env.VITE_WEB_HOST + "/quiz/create-question";
        //adding quiz_id
        await axios
            .post(
                url,
                { quiz_id: parseInt(params.id), ...question },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-API-KEY": localStorage.getItem("session_id"),
                    },
                }
            )
            .then((resp) => {
                isAdded = false;
                const body: HTTPResponse = resp.data as HTTPResponse;
                const out: QuizQuestion = body.data as QuizQuestion;
                toast.success("Question Created successfully");

                //have to make a deep copy
                questions.push(out);

                //clean up
                question.name = "";
                question.choices = [];
                for (let i = 0; i < 3; i++) {
                    const id = randomblob(5);
                    const choice: QuizChoice = { id, name: "", correct: false };
                    question.choices.push(choice);
                }

                //rerender
                questions = questions;
                question = question;
            })
            .catch((err) => {
                isAdded = false;
                const body: HTTPResponse = err.response.data as HTTPResponse;
                toast.error(body.errors);
                console.log(err);
            });
    }

    function deleteQuestion(id: number) {
        questions = questions.filter((q) => q.id != id);
    }

    function addChoice() {
        const rb = randomblob(5);
        question.choices.push({
            id: rb,
            name: "",
            correct: false,
        });
        question = question;
    }
    function deleteChoice(id: number) {
        question.choices = question.choices.filter((choice) => choice.id != id);
        question = question;
    }
</script>

<Toaster />
<div class="w-[800px] p-5 rounded-xl mx-auto flex flex-col gap-7">
    <h1>Quiz id is {params.id}</h1>
    <div class="space-y-2">
        <header class="flex flex-row justify-between items-center">
            <h1 class="text-3xl font-bold text-end">
                Add Question <span class="text-emerald-600">&gt;</span>
            </h1>
        </header>

        <div class="flex flex-col gap-2 relative">
            <label for="question" class="text-lg ml-2">Question</label>
            <textarea
                bind:value={question.name}
                rows="4"
                id="question"
                class="bg-zinc-800 py-2 px-3 rounded-lg outline-none focus:outline-violet-500"
            />
        </div>

        <div class="mt-4">
            <label for="options" class="text-lg ml-2">Options</label>
            <div class="space-y-2 w-full" id="options">
                {#each question.choices as choice, id (choice.id)}
                    <div class="flex items-center gap-2">
                        <input
                            type="checkbox"
                            value={choice.name}
                            bind:checked={choice.correct}
                            name="option"
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-2 focus:ring-2 focus:ring-offset-black"
                        />
                        <div class="w-full">
                            <InputBox
                                bind:value={choice.name}
                                type="text"
                                placeholder="option {id + 1}"
                            />
                        </div>
                        <button
                            on:click={() => {
                                deleteChoice(choice.id);
                            }}
                        >
                            <Icon
                                src={FaTrashCan}
                                size="20"
                                className="fill-red-500 hover:fill-red-700"
                            />
                        </button>
                    </div>
                {/each}
                <div class="flex justify-center">
                    <button
                        disabled={isAdded}
                        on:click={addChoice}
                        class="border w-80 flex items-center justify-center disabled:cursor-not-allowed py-2.5 rounded-lg font-semibold text-white hover:text-slate-300 disabled:bg-zinc-800"
                    >
                        <Icon
                            src={BiPlus}
                            size="20"
                            className="fill-white hover:text-slate-300"
                        />
                        Add Option
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- footer -->
    <button
        on:click={Addquestion}
        class="focus:outline-none bg-violet-500 disabled:cursor-not-allowed py-2.5 rounded-lg font-semibold text-white hover:bg-violet-400 disabled:bg-zinc-800"
    >
        Add Question
    </button>
</div>

<div class="p-8 max-w-7xl mx-auto">
    <h2 class="text-4xl font-bold">Your Questions</h2>
    <!-- FIX: make proper question list -->
    <div class="flex flex-col gap-2 mt-4">
        {#each questions as ques (ques.id)}
            <div>{JSON.stringify(ques)}</div>
        {/each}
    </div>
</div>
