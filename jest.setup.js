const mockLog = jest.fn(() => Promise.resolve());

const mock = jest.fn().mockImplementation(() => {
  return {log: mockLog};
});
mock.prototype.log = mockLog;

jest.mock('sumo-logger', () => mock);
