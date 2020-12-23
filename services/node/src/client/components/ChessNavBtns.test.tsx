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

describe('<ChessNavBtns atStart={false} atEnd={true} ... />', () => {
  const wrapper = shallow(
    <ChessNavBtns
      atStart={false}
      atEnd={true}
      jumpToStart={() => {}}
      jumpToEnd={() => {}}
      stepForward={() => {}}
      stepBack={() => {}}
    />
  );

  it('should have an enabled jumpToStart button', () => {
    expect(wrapper.find('[aria-label="jump to start"]').prop('disabled')).toBe(false);
  });

  it('should have an enabled back button', () => {
    expect(wrapper.find('[aria-label="back"]').prop('disabled')).toBe(false);
  });

  it('should have a disabled forward button', () => {
    expect(wrapper.find('[aria-label="forward"]').prop('disabled')).toBe(true);
  });

  it('should have a disabled jumpToEnd button', () => {
    expect(wrapper.find('[aria-label="jump to end"]').prop('disabled')).toBe(true);
  });
});

describe('<ChessNavBtns atStart={false} atEnd={false} ... />', () => {
  const wrapper = shallow(
    <ChessNavBtns
      atStart={false}
      atEnd={false}
      jumpToStart={() => {}}
      jumpToEnd={() => {}}
      stepForward={() => {}}
      stepBack={() => {}}
    />
  );

  it('should have an enabled jumpToStart button', () => {
    expect(wrapper.find('[aria-label="jump to start"]').prop('disabled')).toBe(false);
  });

  it('should have an enabled back button', () => {
    expect(wrapper.find('[aria-label="back"]').prop('disabled')).toBe(false);
  });

  it('should have an enabled forward button', () => {
    expect(wrapper.find('[aria-label="forward"]').prop('disabled')).toBe(false);
  });

  it('should have an enabled jumpToEnd button', () => {
    expect(wrapper.find('[aria-label="jump to end"]').prop('disabled')).toBe(false);
  });
});
