<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand offset-1" style="font-weight: 900; font-size: 32px;" href="#">play_</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <!-- <form class="form-inline my-2 my-lg-0 offset-1">
        <input class="form-control mr-sm-2" type="search" placeholder="Search" style="font-family: Arial, FontAwesome;">
      </form> -->

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <!-- <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <a class="nav-link" href="#">Showcase</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Events</a>
          </li> 
        </ul> -->
        <ul class="navbar-nav ml-auto mr-5" v-if="loggedIn">
          <li class="nav-item active">
            <router-link class="nav-link btn btn-danger px-5 mx-3" style="border-radius: 20px; color: white;" to="/mint">Create</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link btn btn-primary px-5 mx-3" style="border-radius: 20px; color: white; backgound-color: #003CAB !important;" to="/profile">Profile</router-link>
          </li> 
        </ul>
        <ul class="navbar-nav ml-auto mr-5" v-else>
          <li class="nav-item active">
            <router-link class="nav-link btn btn-primary px-5 mx-3" style="border-radius: 20px; color: white;" to="/login">Login</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <router-view/>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      loggedIn: false
    }
  },

  mounted: function() {
    if (localStorage.loggedIn == "true") {
      this.loggedIn = true
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800;900&display=swap');
@import url("https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css");
@import url("https://use.fontawesome.com/releases/v5.15.4/css/all.css");

html, body {
  font-family: 'Rubik', sans-serif;
}

#app {
  font-family: 'Rubik', sans-serif;
}
</style>
