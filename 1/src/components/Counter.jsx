import React from 'react';

import { useCounterStore } from '../stores/counterStore.js';

const Counter = () => {
  const value = useCounterStore((state) => state.value);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  const reset = useCounterStore((state) => state.reset);

  return (
    <div className="col-5">
      <div className="mb-2" data-testid="value">
        {value}
      </div>
      <div className="btn-group">
        <button type="button" className="btn btn-primary" data-testid="increment" onClick={increment}>
          +
        </button>
        <button type="button" className="btn btn-primary" data-testid="decrement" onClick={decrement}>
          −
        </button>
        <button type="button" className="btn btn-secondary" data-testid="reset" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default Counter;
