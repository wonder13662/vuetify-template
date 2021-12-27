<template>
  <v-card
    width="400"
    class="mx-auto mt-5"
  >
    <v-card-title>
      <h1
        class="display-1"
      >
        {{ $t('views.auth.signIn.title') }}
      </h1>
    </v-card-title>
    <v-cardText>
      <v-form>
        <v-text-field
          v-model="email"
          :label="$t('views.auth.signIn.inputEmail')"
          prepend-icon="mdi-account-circle"
        />
        <v-text-field
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          :label="$t('views.auth.signIn.inputPassword')"
          prepend-icon="mdi-lock"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
        />
      </v-form>
    </v-cardText>
    <v-divider />
    <v-card-actions>
      <v-btn
        text
        @click="onClickSignUp"
      >
        {{ $t('views.auth.signIn.buttonSignUp') }}
      </v-btn>
      <v-spacer />
      <v-btn
        color="info"
        @click="onClickSignIn"
      >
        {{ $t('views.auth.signIn.buttonSignIn') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import store from '@/store';
import auth from '@/lib/auth';

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      error: null,
      showPassword: false,
    };
  },
  methods: {
    onClickSignUp() {
      this.$router.push('/auth/sign-up');
    },
    async onClickSignIn() {
      try {
        // TODO 예외처리 필요 - 패스워드 오류, 존재하지 않는 ID등
        await store.dispatch('auth/signIn', {
          email: this.email,
          password: this.password,
        });
        const loggedIn = store.getters['auth/loggedIn'];
        if (loggedIn) {
          const accessToken = store.getters['auth/accessToken'];
          const refreshToken = store.getters['auth/refreshToken'];
          auth.postProcessSignIn(accessToken, refreshToken);
          await this.$router.push({ path: '/book' });
        }
      } catch (error) {
        store.dispatch('error/addError', error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
