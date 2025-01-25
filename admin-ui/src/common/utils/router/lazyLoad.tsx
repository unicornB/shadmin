import React from "react";
import { LoadableComponent } from '@loadable/component'
const lazyLoad = (Component: LoadableComponent<any>): React.ReactNode => {
  // const Comp = lazy(
  //   () => import(/* @vite-ignore */ `${s}`),
  // );

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Component />
    </React.Suspense>
  );
};
export default lazyLoad;
