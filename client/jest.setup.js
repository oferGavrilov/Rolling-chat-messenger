const sessionStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
};

Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock,
})