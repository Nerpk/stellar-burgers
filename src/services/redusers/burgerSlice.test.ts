import reducer, {
    addIngredient,
    removeIngredient,
    moveIngredientUp,
    moveIngredientDown,
    setBun,
    removeAllIngredients,
    TBurgerState,
    fetchIngredients
  } from './burgerSlice'; 
  import { TConstructorIngredient } from '@utils-types';

  describe('burgerSlice constructor', () => {
    const initialState: TBurgerState = {
        ingredients: [],
        loading: false,
        error: null,
        constructorItems: {
        bun: null,
        ingredients: []
        }
    };
    
    let ingredient1: TConstructorIngredient;
    let ingredient2: TConstructorIngredient;
    let bun: TConstructorIngredient;
    
    beforeEach(() => {
        ingredient1 = {
        id: '1',
        _id: "60666c42cc7b410027a1a9b3",
        name: "Соус Spicy-X",
        type: "sauce",
        proteins: 30,
        fat: 20,
        carbohydrates: 40,
        calories: 150,
        price: 300,
        image: "https://code.s3.yandex.net/react/code/sauce-01.png",
        image_mobile: "https://code.s3.yandex.net/react/code/sauce-01-mobile.png",
        image_large: "https://code.s3.yandex.net/react/code/sauce-01-large.png",
        };
    
        ingredient2 = {
        id: '2',
        _id: "60666c42cc7b410027a1a9b2",
        name: "Филе Люминесцентного тетраодонтимформа",
        type: "main",
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: "https://code.s3.yandex.net/react/code/meat-01.png",
        image_mobile: "https://code.s3.yandex.net/react/code/meat-01-mobile.png",
        image_large: "https://code.s3.yandex.net/react/code/meat-01-large.png",
        };
    
        bun = {
        id: 'bun',
        _id: "60666c42cc7b410027a1a9b1",
        name: "Краторная булка N-200i",
        type: "bun",
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: "https://code.s3.yandex.net/react/code/bun-02.png",
        image_mobile: "https://code.s3.yandex.net/react/code/bun-02-mobile.png",
        image_large: "https://code.s3.yandex.net/react/code/bun-02-large.png",
        };
    });
    
    it('should handle adding an ingredient', () => {
        const newState = reducer(initialState, addIngredient(ingredient1));
        
        expect(newState.constructorItems.ingredients).toHaveLength(1);
        expect(newState.constructorItems.ingredients[0]).toEqual(ingredient1);
    });
    
    it('should handle removing an ingredient', () => {
        const stateWithIngredient = reducer(initialState, addIngredient(ingredient1));
        const newState = reducer(stateWithIngredient, removeIngredient(0));
    
        expect(newState.constructorItems.ingredients).toHaveLength(0);
    });
    
    it('should handle moving an ingredient up', () => {
        let stateWithTwoIngredients = reducer(initialState, addIngredient(ingredient1));
        stateWithTwoIngredients = reducer(stateWithTwoIngredients, addIngredient(ingredient2)); 
        
        const newState = reducer(stateWithTwoIngredients, moveIngredientUp(1)); 
        
        expect(newState.constructorItems.ingredients[0]).toEqual(ingredient2); 
        expect(newState.constructorItems.ingredients[1]).toEqual(ingredient1); 
        });
        
    it('should handle moving an ingredient down', () => {
        const stateWithTwoIngredients = reducer(initialState, addIngredient(ingredient1));
        const stateWithIngredients = reducer(stateWithTwoIngredients, addIngredient(ingredient2));
    
        const newState = reducer(stateWithIngredients, moveIngredientDown(0));
    
        expect(newState.constructorItems.ingredients[0]).toEqual(ingredient2);
        expect(newState.constructorItems.ingredients[1]).toEqual(ingredient1);
    });
    
    it('should handle setting a bun', () => {
        const newState = reducer(initialState, setBun(bun));
    
        expect(newState.constructorItems.bun).toEqual(bun);
    });
    
    it('should handle removing all ingredients', () => {
        const stateWithIngredient = reducer(initialState, addIngredient(ingredient1));
        const newState = reducer(stateWithIngredient, removeAllIngredients());
    
        expect(newState.constructorItems.bun).toBeNull();
        expect(newState.constructorItems.ingredients).toHaveLength(0);
    });
    });
  
  describe('burgerSlice reducer', () => {
    let initialState: TBurgerState;
  
    beforeEach(() => {
      initialState = {
        ingredients: [],
        loading: false,
        error: null,
        constructorItems: {
          bun: null,
          ingredients: []
        }
      };
    });
  
    it('should handle fetchIngredients pending', () => {
      const newState = reducer(initialState, fetchIngredients.pending(''));
      expect(newState.loading).toBe(true);
      expect(newState.error).toBe(null);
    });
  
    it('should handle fetchIngredients fulfilled', () => {
      const ingredients = [
        {
          _id: "60666c42cc7b410027a1a9b1",
          name: "Краторная булка N-200i",
          type: "bun",
          proteins: 80,
          fat: 24,
          carbohydrates: 53,
          calories: 420,
          price: 1255,
          image: "https://code.s3.yandex.net/react/code/bun-02.png",
          image_mobile: "https://code.s3.yandex.net/react/code/bun-02-mobile.png",
          image_large: "https://code.s3.yandex.net/react/code/bun-02-large.png",
        },
      ];
  
      const newState = reducer(initialState, fetchIngredients.fulfilled(ingredients, ''));
      expect(newState.loading).toBe(false);
      expect(newState.ingredients).toEqual(ingredients);
      expect(newState.error).toBe(null);
    });
  
    it('should handle fetchIngredients rejected', () => {
      const error = new Error('Failed to fetch ingredients');
      const action = fetchIngredients.rejected(
        error, 
        '', 
      );
      const newState = reducer(initialState, action);
      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(error.message); 
    });
  });
  