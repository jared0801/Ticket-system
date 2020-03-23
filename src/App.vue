<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  }
}
</script>

<style lang="scss">
@import "~bulma/css/bulma.css";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

html, body, #app {
  height: 100%;
}

.content {
    margin: auto;
    width: 80%;
}

.content ul {
    list-style: none;
    margin: 0;
}

.button-div {
    display: flex;
    justify-content: flex-end;
}
.button-div .control {
    margin-left: 1em;
}
.button-div .delete-control {
    justify-self: flex-start;
    width: 100%;
    margin: 0;
}

// Styling for vue-autosuggest cannot be scoped
.suggestion-item {
    display: block;
    width: 100%;
}

.result-container {
    overflow-y: scroll;
    max-height: 150px;
    padding: 10px;
}
</style>
