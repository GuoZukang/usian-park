import Vue from "vue";
import store from "@/store";

Vue.directive("auth-btn", {
  inserted(el, binding) {
    console.log("el=>", el);
    console.log("binding=>", binding.value);
    const val = binding.value;
    const periss = store.state.user.profile.permissions;
    const isValid = periss.includes(val);
    if (!isValid) {
      el.parentNode.removeChild(el);
    }
  },
});
