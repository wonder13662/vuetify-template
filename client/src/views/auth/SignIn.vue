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
      // TODO Hot reloaded 평가해보기(쓸만한가?)
      // https://vuex.vuejs.org/guide/hot-reload.html

      const credentials = {
        v: 1,
        email: this.email,
        password: this.password,
        role: 'director',
      };

      try {
        // TODO 로그인 예외 상황에 대한 처리는 안되어있음. 기획하여 추가 필요.
        /* eslint-disable no-console */
        await store.dispatch('auth/signIn', credentials);
        const loggedIn = store.getters['auth/loggedIn'];
        if (loggedIn) {
          const accessToken = store.getters['auth/accessToken'];
          const refreshToken = store.getters['auth/refreshToken'];
          auth.postProcessSignIn(accessToken, refreshToken);
          await this.$router.push({ path: '/admin/dashboard' });
        }
        // TODO 예외처리 필요 - 패스워드 오류, 존재하지 않는 ID등
      } catch (error) {
        // catch 안에서 에러 객체를 수집, store에 저장
        store.dispatch('error/addError', error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
