import React, { lazy } from "react";
const lazyLoad = (s: string): React.ReactNode => {
  const Comp: React.LazyExoticComponent<() => JSX.Element> = lazy(
    () => import(/* @vite-ignore */ `../../../${s}`),
  );
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Comp />
    </React.Suspense>
  );
};
export default lazyLoad;
