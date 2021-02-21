<template>
  <section class="hero is-danger is-fullheight">
     <div class="hero-body">
            <div class="container has-text-centered">
                <div class="column is-4 is-offset-4">
                    <h3 class="title has-text-white">Register</h3>
                    <hr class="login-hr">
                    <div class="box">
                        <form>
                            <div class="field">
                                <div class="control">
                                    <input class="input is-large" type="email" placeholder="Your Email" autofocus="">
                                </div>
                            </div>

                            <div class="field">
                                <div class="control">
                                    <input class="input is-large" type="text" placeholder="Your Nickname">
                                </div>
                            </div>

                            <div class="field">
                                <div class="control">
                                    <input class="input is-large" type="password" placeholder="Your Password">
                                </div>
                            </div>
                            <button class="button is-block is-info is-large is-fullwidth">Register<i class="fa fa-sign-in" aria-hidden="true"></i></button>
                        </form>
                    </div>
                    <p class="has-text-white">
                        <router-link to="/login">Log In</router-link>&nbsp;
                    </p>
                </div>
            </div>
        </div>
  </section>
</template>

<script>
export default {
  name: 'Register',
  components: {
  }
}
</script>

<style scoped>

</style>