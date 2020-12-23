import React from 'react';
import { shallow } from 'enzyme';
import ChessNavBtns from './ChessNavBtns';

describe('<ChessNavBtns atStart={true} atEnd={false} ... />', () => {
  const wrapper = shallow(
    <ChessNavBtns
      atStart={true}
      atEnd={false}
      jumpToStart={() => {}}
      jumpToEnd={() => {}}
      stepForward={() => {}}
      stepBack={() => {}}
    />
  );

  it('should have a disabled jumpToStart button', () => {
    expect(wrapper.find('[aria-label="jump to start"]').prop('disabled')).toBe(true);
  });

  it('should have a disabled back button', () => {
    expect(wrapper.find('[aria-label="back"]').prop('disabled')).toBe(true);
  });

  it('should have an enabled forward button', () => {
    expect(wrapper.find('[aria-label="forward"]').prop('disabled')).toBe(false);
  });

  it('should have an enabled jumpToEnd button', () => {
    expect(wrapper.find('[aria-label="jump to end"]').prop('disabled')).toBe(false);
  });
});
