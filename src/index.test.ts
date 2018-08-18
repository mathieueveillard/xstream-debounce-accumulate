import { describe, it } from 'mocha';
import { Stream } from 'xstream';
import { mockTimeSource, MockTimeSource } from '@cycle/time';
import { DebounceAndAccumulateSettings } from '.';
import makeDebounceAndAccumulate from '.';

const timeSource: MockTimeSource = mockTimeSource({ interval: 20 });

describe.only('Test of combineAndWait()', function() {
  it('should debounce as regular operator but accumulate values meanwhile', function(done) {
    // GIVEN
    const $: Stream<number> = timeSource.diagram('--1------1-1-1-11-1-----1------');

    // WHEN
    const debounceAndAccumulate = makeDebounceAndAccumulate(timeSource);
    const settings: DebounceAndAccumulateSettings<number> = {
      period: 80,
      accumulate: (accumulator: number, current: number) => accumulator + current,
      seed: 0
    };
    const actual$ = $.compose(debounceAndAccumulate(settings));

    // THEN
    const expected$: Stream<number> = timeSource.diagram('------1---------------6-----1--');
    timeSource.assertEqual(actual$, expected$);
    timeSource.run(done);
  });
});
