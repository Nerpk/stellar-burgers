import reducer, {
    setAuth,
    setUser,
    outUser,
    registerUser,
    loginUser,
    updateUser,
    logoutUser,
    userInitialState,
    UserState
  } from './userSlice';
  import { TUser } from '@utils-types';
  
  describe('userSlice reducer', () => {
    let initialState: UserState;
    const userInfo = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123'
      }
  
    beforeEach(() => {
      initialState = userInitialState;
    });
  
    describe('should handle setAuth', () => {
      it('should set isAuth to true', () => {
        const newState = reducer(initialState, setAuth(true));
        expect(newState.isAuth).toBe(true);
      });
  
      it('should set isAuth to false', () => {
        const newState = reducer(initialState, setAuth(false));
        expect(newState.isAuth).toBe(false);
      });
    });
  
    describe('should handle setUser', () => {
      it('should set user data', () => {
        const user: TUser = {
          email: "test@example.com",
          name: "Test User",
        };
        const newState = reducer(initialState, setUser(user));
        expect(newState.user).toEqual(user);
      });
    });
  
    describe('should handle outUser', () => {
      it('should set user to null and isAuth to false', () => {
        const loggedInState = {
          ...initialState,
          user: { email: "test@example.com", name: "Test User" },
          isAuth: true,
        };
        const newState = reducer(loggedInState, outUser());
        expect(newState.user).toBe(null);
        expect(newState.isAuth).toBe(false);
      });
    });
  
    describe('should handle registerUser', () => {
        it('pending', () => {
            const newState = reducer(initialState, registerUser.pending('', userInfo)); 
            expect(newState.isLoading).toBe(true);
            expect(newState.error).toBe(undefined);
          });
          
  
      it('fulfilled', () => {
        const user = {
          email: "test@example.com",
          name: "Test User",
        };
        const newState = reducer(initialState, registerUser.fulfilled(user, '', userInfo));
        expect(newState.isLoading).toBe(false);
        expect(newState.user).toEqual(user);
        expect(newState.isAuth).toBe(true);
      });
  
      it('rejected', () => {
        const error = "Registration failed";
        const newState = reducer(initialState, registerUser.rejected(null, '', userInfo, error));
        expect(newState.isLoading).toBe(false);
        expect(newState.error).toBe(error);
      });
    });
  
    describe('should handle loginUser', () => {
      it('pending', () => {
        const newState = reducer(initialState, loginUser.pending('', userInfo));
        expect(newState.isLoading).toBe(true);
        expect(newState.error).toBe(undefined);
      });
  
      it('fulfilled', () => {
        const user = {
          email: "test@example.com",
          name: "Test User",
        };
        const newState = reducer(initialState, loginUser.fulfilled(user, '', userInfo));
        expect(newState.isLoading).toBe(false);
        expect(newState.user).toEqual(user);
        expect(newState.isAuth).toBe(true);
      });
  
      it('rejected', () => {
        const error = "Login failed";
        const newState = reducer(initialState, loginUser.rejected(null, '', userInfo, error));
        expect(newState.isLoading).toBe(false);
        expect(newState.error).toBe(error);
      });
    });
  
    describe('should handle updateUser', () => {
      it('pending', () => {
        const newState = reducer(initialState, updateUser.pending('', userInfo));
        expect(newState.isLoading).toBe(true);
        expect(newState.error).toBe(undefined);
      });
  
      it('fulfilled', () => {
        const updatedUser = {
          email: "updated@example.com",
          name: "Updated User",
        };
        const newState = reducer(initialState, updateUser.fulfilled(updatedUser, '', userInfo));
        expect(newState.isLoading).toBe(false);
        expect(newState.user).toEqual(updatedUser);
        expect(localStorage.getItem('user')).toEqual(JSON.stringify(updatedUser));
      });
  
      it('rejected', () => {
        const error = "Update failed";
        const newState = reducer(initialState, updateUser.rejected(null, '', userInfo, error));
        expect(newState.isLoading).toBe(false);
        expect(newState.error).toBe(error);
      });
    });
  
    describe('should handle logoutUser', () => {
      it('fulfilled', () => {
        const loggedInState = {
          ...initialState,
          user: { email: "test@example.com", name: "Test User" },
          isAuth: true,
        };
        const newState = reducer(loggedInState, logoutUser.fulfilled(undefined, ''));
        expect(newState.isAuth).toBe(false);
        expect(newState.user).toBe(null);
      });
    });
  });
  