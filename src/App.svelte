<script lang="ts">
    import GuestView from "./views/guest/GuestView.svelte";
    import PlayerView from "./views/player/PlayerView.svelte";
    import HostView from "./views/host/HostView.svelte";
    import HostCreateQuizView from "./views/host/HostCreateQuizView.svelte";
    import HostCreateQuestionView from "./views/host/HostCreateQuestionView.svelte";
    import Router from "svelte-spa-router";

    let routes = {
        "/": GuestView,
        "/player": PlayerView,
        "/host": HostView,
        "/host/quiz": HostCreateQuizView,
        "/host/quiz/:id": HostCreateQuestionView,
    };
</script>

<Router {routes} />
