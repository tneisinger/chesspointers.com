import React from 'react';
import { shallow } from 'enzyme';
import ChessNavBtns from './ChessNavBtns';

// Constants used to select buttons based on their "aria-label" values
const btnLabelToStart = 'jump to start';
const btnLabelToEnd = 'jump to end';
const btnLabelStepForward = 'step forward';
const btnLabelStepBack = 'step back';

// Creates the string used to select a button using its aria-label
const withLabel = (ariaLabel: string): string => `[aria-label="${ariaLabel}"]`

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
    expect(wrapper.find(withLabel(btnLabelToStart)).prop('disabled')).toBe(true);
  });

  it('should have a disabled back button', () => {
    expect(wrapper.find(withLabel(btnLabelStepBack)).prop('disabled')).toBe(true);
  });

  it('should have an enabled forward button', () => {
    expect(wrapper.find(withLabel(btnLabelStepForward)).prop('disabled')).toBe(false);
  });

  it('should have an enabled jumpToEnd button', () => {
    expect(wrapper.find(withLabel(btnLabelToEnd)).prop('disabled')).toBe(false);
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
    expect(wrapper.find(withLabel(btnLabelToStart)).prop('disabled')).toBe(false);
  });

  it('should have an enabled back button', () => {
    expect(wrapper.find(withLabel(btnLabelStepBack)).prop('disabled')).toBe(false);
  });

  it('should have a disabled forward button', () => {
    expect(wrapper.find(withLabel(btnLabelStepForward)).prop('disabled')).toBe(true);
  });

  it('should have a disabled jumpToEnd button', () => {
    expect(wrapper.find(withLabel(btnLabelToEnd)).prop('disabled')).toBe(true);
  });
});

describe('<ChessNavBtns atStart={false} atEnd={false} ... />', () => {
  // mock all the callback functions
  const mockJumpToStartFn = jest.fn(() => {});
  const mockJumpToEndFn = jest.fn(() => {});
  const mockStepForwardFn = jest.fn(() => {});
  const mockStepBackFn = jest.fn(() => {});

  const wrapper = shallow(
    <ChessNavBtns
      atStart={false}
      atEnd={false}
      jumpToStart={mockJumpToStartFn}
      stepBack={mockStepBackFn}
      stepForward={mockStepForwardFn}
      jumpToEnd={mockJumpToEndFn}
    />
  );

  // Get each of the buttons
  const btnJumpToStart = wrapper.find(withLabel(btnLabelToStart)).first();
  const btnStepBack = wrapper.find(withLabel(btnLabelStepBack)).first();
  const btnStepForward = wrapper.find(withLabel(btnLabelStepForward)).first();
  const btnJumpToEnd = wrapper.find(withLabel(btnLabelToEnd)).first();

  it('should have an enabled jumpToStart button', () => {
    expect(btnJumpToStart.prop('disabled')).toBe(false);
  });

  it('should have an enabled back button', () => {
    expect(btnStepBack.prop('disabled')).toBe(false);
  });

  it('should have an enabled forward button', () => {
    expect(btnStepForward.prop('disabled')).toBe(false);
  });

  it('should have an enabled jumpToEnd button', () => {
    expect(btnJumpToEnd.prop('disabled')).toBe(false);
  });

  it('should run jumpToStart callback when btnJumpToStart clicked', () => {
    expect(mockJumpToStartFn).toHaveBeenCalledTimes(0);
    btnJumpToStart.simulate('click');
    expect(mockJumpToStartFn).toHaveBeenCalledTimes(1);
  });

  it('should run stepBack callback when btnStepBack clicked', () => {
    expect(mockStepBackFn).toHaveBeenCalledTimes(0);
    btnStepBack.simulate('click');
    expect(mockStepBackFn).toHaveBeenCalledTimes(1);
  });

  it('should run stepForward callback when btnStepForward clicked', () => {
    expect(mockStepForwardFn).toHaveBeenCalledTimes(0);
    btnStepForward.simulate('click');
    expect(mockStepForwardFn).toHaveBeenCalledTimes(1);
  });

  it('should run jumpToEnd callback when btnJumpToEnd clicked', () => {
    expect(mockJumpToEndFn).toHaveBeenCalledTimes(0);
    btnJumpToEnd.simulate('click');
    expect(mockJumpToEndFn).toHaveBeenCalledTimes(1);
  });
});
