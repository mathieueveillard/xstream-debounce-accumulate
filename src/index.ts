import { Stream } from 'xstream';
import split from 'xstream/extra/split';
import { TimeSource } from '@cycle/time';
import * as R from 'ramda';

export interface DebounceAndAccumulateSettings<T> {
  period: number;
  accumulate: (accumulator: T, current: T) => T;
  seed: T;
}

export default function makeDebounceAndAccumulate<T>(timeSource: TimeSource) {
  return function({ period, accumulate, seed }: DebounceAndAccumulateSettings<T>) {
    return function($: Stream<T>): Stream<T> {
      /*
       * Implementation details: instead of implementing an operator as such,
       * we use a combination of existing operators.
       * 
       * ---1--------1-1-1-1-1-1-------------1------------- input
       * -------1------------------1-------------1--------- regular debounce (1)
       * :--1---|                                           start a new stream and accumulate each time (1) emits an event (2)
       *        :----1-2-3-4-5-6---|
       *                           :---------1---|
       *                                         :---------
       * -------1------------------6-------------1--------- take last value emitted on (2) and flatten
       */

      const regularlyDebounced$: Stream<T> = $.compose(timeSource.debounce(period));
      // @ts-ignore
      return $.compose(split(regularlyDebounced$))
        .map(R.partial(accumulateStream, [accumulate, seed]))
        .map(last)
        .flatten();
    };
  };
}

function accumulateStream<T>(accumulate: (accumulator: T, current: T) => T, seed: T, $: Stream<T>): Stream<T> {
  return $.fold(accumulate, seed);
}

function last<T>($: Stream<T>): Stream<T> {
  return $.last();
}
