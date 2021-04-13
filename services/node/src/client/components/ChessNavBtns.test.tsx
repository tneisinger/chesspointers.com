import React from 'react';
import Enzyme, { shallow, mount, ShallowWrapper, ReactWrapper } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import ChessNavBtns from './ChessNavBtns';
import { assertUnreachable } from '../../shared/utils';

Enzyme.configure({ adapter: new Adapter() });

type Wrapper = ShallowWrapper<any, any> | ReactWrapper<any, any, any>;

// Constants used to select buttons based on their "aria-label" values
enum BtnLabel {
  JumpToStart = 'jump to start',
  JumpToEnd = 'jump to end',
  StepForward = 'step forward',
  StepBack = 'step back',
};

// Creates the string used to select a button using its aria-label
const withLabel = (btnLabel: BtnLabel): string => `[aria-label="${btnLabel}"]`;

const getBtn = (btnLabel: BtnLabel, wrapper: Wrapper) => (
  wrapper.find(withLabel(btnLabel)).first()
);

const isBtnEnabled = (btnLabel: BtnLabel, wrapper: Wrapper) => (
  !getBtn(btnLabel, wrapper).prop('disabled')
);

function testBtnsEnabled(options: {
  areBackBtnsEnabled: boolean,
  areForwardBtnsEnabled: boolean,
}): void {
  const wrapper = shallow(
    <ChessNavBtns
      areBackBtnsEnabled={options.areBackBtnsEnabled}
      areForwardBtnsEnabled={options.areForwardBtnsEnabled}
      jumpToStart={() => {}}
      jumpToEnd={() => {}}
      stepForward={() => {}}
      stepBack={() => {}}
    />,
  );

  const mkDescription = (shouldBeEnabled: boolean, btnLabel: BtnLabel): string => {
    let result = '';
    result += shouldBeEnabled ? 'should ' : 'should not ';
    result += `have an enabled ${btnLabel} button`;
    return result;
  };

  const testBtnEnabled = (btnLabel: BtnLabel): void => {
    let shouldBeEnabled: boolean;
    if (btnLabel === BtnLabel.JumpToStart || btnLabel === BtnLabel.StepBack) {
      shouldBeEnabled = options.areBackBtnsEnabled;
    } else {
      shouldBeEnabled = options.areForwardBtnsEnabled;
    }

    it(mkDescription(shouldBeEnabled, btnLabel), () => {
      expect(isBtnEnabled(btnLabel, wrapper)).toBe(shouldBeEnabled);
    });
  };

  Object.values(BtnLabel).forEach((btnLabel) => {
    testBtnEnabled(btnLabel);
  });
}

function testCallbacks(options: {
  areBackBtnsEnabled: boolean,
  areForwardBtnsEnabled: boolean,
}): void {
  // mock all the callback functions
  const mockJumpToStartFn = jest.fn(() => {});
  const mockJumpToEndFn = jest.fn(() => {});
  const mockStepForwardFn = jest.fn(() => {});
  const mockStepBackFn = jest.fn(() => {});

  const wrapper = mount(
    <ChessNavBtns
      areBackBtnsEnabled={options.areBackBtnsEnabled}
      areForwardBtnsEnabled={options.areForwardBtnsEnabled}
      jumpToStart={mockJumpToStartFn}
      stepBack={mockStepBackFn}
      stepForward={mockStepForwardFn}
      jumpToEnd={mockJumpToEndFn}
    />,
  );

  const mkDescription = (shouldRunCallback: boolean, btnLabel: BtnLabel): string => {
    let result = '';
    result += shouldRunCallback ? 'should ' : 'should not ';
    result += `run ${btnLabel} callback when ${btnLabel} button clicked`;
    return result;
  };

  const testClickBtn = (btnLabel: BtnLabel) => {
    const btn = getBtn(btnLabel, wrapper)
    let callbackFn: () => void;
    let shouldRunCallback: boolean;
    switch (btnLabel) {
      case BtnLabel.JumpToStart:
        shouldRunCallback = options.areBackBtnsEnabled;
        callbackFn = mockJumpToStartFn;
        break;
      case BtnLabel.StepBack:
        shouldRunCallback = options.areBackBtnsEnabled;
        callbackFn = mockStepBackFn;
        break;
      case BtnLabel.StepForward:
        shouldRunCallback = options.areForwardBtnsEnabled;
        callbackFn = mockStepForwardFn;
        break;
      case BtnLabel.JumpToEnd:
        shouldRunCallback = options.areForwardBtnsEnabled;
        callbackFn = mockJumpToEndFn;
        break;
      default:
        assertUnreachable(btnLabel);
    }

    it(mkDescription(shouldRunCallback, btnLabel), () => {
      expect(callbackFn).toHaveBeenCalledTimes(0);
      btn.simulate('click');
      expect(callbackFn).toHaveBeenCalledTimes(shouldRunCallback ? 1 : 0);
    });
  }

  Object.values(BtnLabel).forEach((btnLabel) => {
    testClickBtn(btnLabel);
  });
};

describe('ChessNavBtns with all buttons disabled', () => {
  const options = { areBackBtnsEnabled: false, areForwardBtnsEnabled: false };
  testBtnsEnabled(options);
  testCallbacks(options);
});

describe('ChessNavBtns with backBtns enabled and forwardBtns disabled', () => {
  const options = { areBackBtnsEnabled: true, areForwardBtnsEnabled: false };
  testBtnsEnabled(options);
  testCallbacks(options);
});

describe('ChessNavBtns with backBtns disabled and forwardBtns enabled', () => {
  const options = { areBackBtnsEnabled: false, areForwardBtnsEnabled: true };
  testBtnsEnabled(options);
  testCallbacks(options);
});

describe('ChessNavBtns with all buttons enabled', () => {
  const options = { areBackBtnsEnabled: true, areForwardBtnsEnabled: true };
  testBtnsEnabled(options);
  testCallbacks(options);
});
