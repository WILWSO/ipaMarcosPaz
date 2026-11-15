<script>
 import {highlightParts} from './search.mjs';
 export let text='';
 export let query='';
 export let prefixLast=true;
 $: parts=highlightParts(text,query,{prefixLast});
</script>
{#each parts as part}{#if part.match}<mark>{part.text}</mark>{:else}{part.text}{/if}{/each}
<style>
 mark{background:#ffe498;color:#243b35;border-radius:2px;padding:0 .04em;box-decoration-break:clone}
</style>
