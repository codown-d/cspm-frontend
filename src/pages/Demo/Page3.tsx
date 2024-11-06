import { Suspense, lazy } from 'react';
// import Risks from '../Risks';

function delayForDemo(promise) {
  return new Promise((resolve) => {
    setTimeout(resolve, 2000);
  }).then(() => promise);
}

const Risks = lazy(() => delayForDemo(import('../Risks')));

function Page3() {
  return (
    <div>
      <Suspense fallback={11111}>
        <Risks />
      </Suspense>
    </div>
  );
}

export default Page3;
