import { loginApi, profileApi } from "@/api/login";
import { getToken, setToken, removeToken } from "@/utils/auth";

const state = {
  token: getToken() || "",
  profile: null,
};

const mutations = {
  setToken(state, token) {
    state.token = token;
    setToken(token);
  },
  setProfile(state, profile) {
    state.profile = profile;
  },
  removeToken(state) {
    state.token = "";
    state.profile = null;
    removeToken();
  },
};

const actions = {
  async login({ commit }, payload) {
    try {
      delete payload.isAgree;
      const { data } = await loginApi(payload);
      commit("setToken", data.token);
    } catch (error) {
      console.log(error);
    }
  },
  async logout({ commit }) {
    try {
      commit("removeToken");
    } catch (error) {
      console.log(error);
    }
  },
  async profile({ commit }) {
    try {
      const { data } = await profileApi();
      commit("setProfile", data);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
