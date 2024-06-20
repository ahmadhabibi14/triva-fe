<script lang="ts">
  import { onMount } from 'svelte';
  import QuizCard from '../../lib/QuizCard.svelte';
  import type { HTTPResponse } from '../../types/http';
  import type { Quiz } from '../../types/quiz';
  import axios from 'axios';
  import toast, { Toaster } from 'svelte-french-toast';

  let quizzes: Quiz[] = [];

  async function getQuizzes(): Promise<void> {
    const url: string = import.meta.env.VITE_WEB_HOST+'/quiz/quizzes';

    await axios.get(url, {
      headers: {
        'X-API-KEY': localStorage.getItem('session_id')
      },
      withCredentials: true
    }).then((resp) => {
      const body: HTTPResponse = resp.data as HTTPResponse;
      quizzes = body.data as Quiz[];
    }).catch((err) => {
      const body: HTTPResponse = err.response.data as HTTPResponse;
      toast.error(body.errors);
      console.log(err);
    });
  }

  onMount(async () => {
    await getQuizzes();
  })
</script>

<Toaster />

<div class="p-8 max-w-7xl mx-auto">
  <h2 class="text-4xl font-bold">Your Quizzes</h2>
  <div class="w-full">
    <textarea></textarea>
  </div>
  <div class="flex flex-col gap-2 mt-4">
    {#each quizzes as quiz (quiz.id)}
      <QuizCard on:host {quiz} />
    {/each}
  </div>
</div>