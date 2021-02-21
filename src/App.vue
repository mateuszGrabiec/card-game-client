<template>
  <div id="app">
    <nav class="navbar">

      <router-link class="navbar-item" to="/">Home</router-link>
      <div class="navbar-end">
        <div class="buttons">
          <router-link class="navbar-item button" to="/login">Login</router-link>
          <router-link class="navbar-item button" to="/register">Register</router-link>
        </div>
      </div>
    </nav>


    <router-view />
    <!-- <BlockGame /> -->
    <!-- <Board/> -->
  </div>
</template>

<script>

// import Board from "./components/KonvaTest"

export default {
  name: "App",
  components: {
    //Board
  }
};
</script>

<style>
</style>
