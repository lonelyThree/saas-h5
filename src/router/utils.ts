export const loadView = (view: string) => {
  // 注意路径层级，根据调用者的位置调整，或者使用绝对路径 @/views
  return () => import(/* @vite-ignore */ `@/views/${view}.vue`)
}