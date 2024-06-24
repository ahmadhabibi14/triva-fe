<script lang="ts">
    import toast, { Toaster } from "svelte-french-toast";
    import HostCreateQuestionView from "./HostCreateQuestionView.svelte";
    import { TrOutlineHome } from "svelte-icons-pack/tr";
    import { link, replace } from "svelte-spa-router";
    import { Icon } from "svelte-icons-pack";
    import InputBox from "../../lib/InputBox.svelte";
    import axios from "axios";
    import type { HTTPResponse } from "@/types/http";

    let name: string;
    let description: string;
    let isSubmitted: boolean = false;

    type QuizIn = {
        name: string;
    };
    type QuizOut = {
        quiz: {
            id: number;
        };
    };

    async function CreateQuiz() {
        isSubmitted = true;
        const payload: QuizIn = { name };
        const url: string = import.meta.env.VITE_WEB_HOST + "/quiz/create-quiz";
        const session_id: string = localStorage.getItem("session_id") || "";

        await axios
            .post(url, payload, {
                headers: {
                    "Content-Type": "application/json",
                    "X-API-KEY": session_id,
                },
            })
            .then((resp) => {
                isSubmitted = false;
                const body: HTTPResponse = resp.data as HTTPResponse;
                const out: QuizOut = body.data as QuizOut;
                toast.success("Created Quiz sucessfully");
                replace("/host/quiz/" + out.quiz.id.toString());
            })
            .catch((err) => {
                isSubmitted = false;
                const body: HTTPResponse = err.response.data as HTTPResponse;
                toast.error(body.errors);
                console.log(err);
            });
    }
</script>

<Toaster />

<div class="flex flex-col w-full justify-center h-fit mt-10">
    <div
        class="w-[400px] bg-zinc-900 p-5 rounded-xl mx-auto flex flex-col gap-7"
    >
        <header class="flex flex-row justify-between items-center">
            <h1 class="text-3xl font-bold text-end">
                Create Quiz <span class="text-emerald-600">&gt;</span>
            </h1>
            <a
                href="/"
                use:link
                class="focus:outline-none flex justify-center items-center p-2 bg-zinc-800 rounded-lg group hover:bg-violet-500/10"
            >
                <Icon
                    src={TrOutlineHome}
                    size="20"
                    className="group-hover:stroke-violet-500"
                />
            </a>
        </header>
        <form class="flex flex-col gap-4">
            <InputBox
                id="Name"
                type="text"
                bind:value={name}
                placeholder="Quiz Name"
                label="Quiz Name"
            />
            <InputBox
                id="desc"
                type="text"
                bind:value={description}
                placeholder="Description"
                label="Description"
            />
            <button
                disabled={isSubmitted}
                class="focus:outline-none bg-violet-500 disabled:cursor-not-allowed py-2.5 rounded-lg font-semibold
        text-white hover:bg-violet-400 disabled:bg-zinc-800"
                on:click|preventDefault={CreateQuiz}
            >
                {#if !isSubmitted}
                    Create Quiz
                {/if}
                {#if isSubmitted}
                    Creating Quiz ...
                {/if}
            </button>
        </form>
    </div>
</div>
