import { DeepReadonly, readonly, Ref, ref } from 'vue';

export const useState = <T>(
  initialState: T
): [Readonly<Ref<DeepReadonly<T>>>, (newState: T) => void] => {
  const state = ref(initialState) as Ref<T>;
  const setState = (newState: T) => {
    state.value = newState;
  };

  return [readonly(state), setState];
};
