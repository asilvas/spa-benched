<script>
	import loadStuff from '../_shared/util/load-stuff';
	import compileStuff from '../_shared/util/compile-stuff';

	export let el;
	export let useSafeWord;
	export let usePriority;
	export let limit;
	export let index;

	const test = window.test;
	const bench = window.bench;
	const { LOAD_STATES } = bench;

	$: inner = el.text(el, { loadState: el.loadState });
	$: className = el.classes(el, { loadState: el.loadState });
	$: propsOrig = el.props(el, { loadState: el.loadState });
	$: name = propsOrig.name;
	$: propKeys = propsOrig && Object.keys(propsOrig) || [];
  $: props = propKeys.reduce((state, key) => {
		state[`data-${key}`] = propsOrig[key];
		return state;
	}, {});
	//$: console.log(`RENDER CHILD: el.id=${el.id} el.index=${el.index} index=${index} el.state=${el.loadState}`);
	$: if (el.loadState === LOAD_STATES.PENDING && !el.initialized) {
		el.initialized = true; // HACK! never fire more than once
		if (!el.modules || el.modules.length === 0) {
			test.dispatch({ type: 'LOAD_STATE', el, index: el.index, loadState: LOAD_STATES.READY });
		} else {
			test.dispatch({ type: 'LOAD_STATE', el, index: el.index, loadState: LOAD_STATES.LOADING });
			loadStuff(el.modules, { useSafeWord, usePriority, priority: el.priority, limit }).then(stuff => {
				test.dispatch({ type: 'LOAD_STATE', el, index: el.index, loadState: LOAD_STATES.COMPILING });
				compileStuff(stuff, { useSafeWord, usePriority, priority: el.priority, limit }).then(() => test.dispatch({ type: 'LOAD_STATE', el, index, loadState: LOAD_STATES.READY }));
			});
		}
	}

</script>

{#if el.etag === 'span'}
	<span id="{el.id}" class="{className}" {...props}>{inner}</span>
{:else}
	<div id="{el.id}" class="{className}" {...props}>{inner}</div>
{/if}
