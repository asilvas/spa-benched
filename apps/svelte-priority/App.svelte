<script>
	import Child from './Child.svelte';

	export let useSafeWord;
	export let usePriority;
	export let limit;

	const test = window.test;

	let latestState = test.initialState;

	//$: console.log('RENDER APP', latestState.length);

	function setState(newState) { // emmulate React'ish setState pattern by deferring states
		latestState = newState;
	}

	const stateManager = (latestState, reducer, action) => {
		reducer(latestState, action);
		return latestState; // state is mutated in-place, but not returned
	}

	test.dispatch = action => {
		// produce new state (use next if avail, otherwise latest)
		setState(stateManager(latestState, test.reducer, action));
	};

</script>

<div>
	{#each latestState as el, index (el.id)}
		<Child el={el} useSafeWord={useSafeWord} usePriority={usePriority} limit={limit} index={index} />
	{/each}
</div>
