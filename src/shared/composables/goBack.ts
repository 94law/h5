import { useRouter } from 'vue-router';

export function useGoBack() {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return goBack;
}
