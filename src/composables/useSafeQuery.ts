import { useRoute } from 'vue-router';
export function useSafeQuery() {
  const route = useRoute();
  return new Proxy(route.query as any, {
    get(target, key: string) {
      const val = target[key];
      return Array.isArray(val) ? val : val;
    }
  });
};
