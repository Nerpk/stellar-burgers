import reducer, {
    clearOrderDetails,
    setNewOrder,
    fetchOrders,
    fetchOrderByNumber,
    createNewOrder,
    fetchFeeds,
    TOrderState,
    orderInitialState, 
    clearNewOrder
  } from './orderSlice'; 
  import { TOrder } from '@utils-types';

  describe('orderSlice selector reducer', () => {
    it('should handle clearOrderDetails', () => {
        const stateWithOrderDetails = {
          ...orderInitialState,
          orderDetails: {
            _id: "1",
            name: "Order 1",
            status: "done",
            createdAt: "2023-10-23T10:00:00Z",
            updatedAt: "2023-10-23T11:00:00Z",
            number: 1,
            ingredients: ["ingredient1", "ingredient2"]
          },
        };
      
        const newState = reducer(stateWithOrderDetails, clearOrderDetails());
        expect(newState.orderDetails).toBe(null);
      });
      
      it('should handle setNewOrder', () => {
        const newOrder: TOrder = {
            _id: "1",
            name: "Order 1",
            status: "done",
            createdAt: "2023-10-23T10:00:00Z",
            updatedAt: "2023-10-23T11:00:00Z",
            number: 1,
            ingredients: ["ingredient1", "ingredient2"]
          };
    
        const newState = reducer(orderInitialState, setNewOrder(newOrder));
        expect(newState.newOrder.orderModalData).toEqual(newOrder);
      });
    
      it('should handle clearNewOrder', () => {
        const stateWithNewOrderData = {
          ...orderInitialState,
          newOrder: {
            orderModalData: {
              _id: "1",
              name: "Order 1",
              status: "done",
              createdAt: "2023-10-23T10:00:00Z",
              updatedAt: "2023-10-23T11:00:00Z",
              number: 1234,
              ingredients: ["ingredient1", "ingredient2"]
            },
            loading: false,
            error: null
          },
        };
      
        const newState = reducer(stateWithNewOrderData, clearNewOrder());
        expect(newState.newOrder.orderModalData).toBe(null);
      });
  }) 
  
  describe('orderSlice reducer', () => {
    let initialState: TOrderState;
  
    beforeEach(() => {
      initialState = orderInitialState;
    });

    describe('should handle fetchOrders', () => {
        it('pending', () => {
            const newState = reducer(initialState, fetchOrders.pending(''));
            expect(newState.loading).toBe(true);
            expect(newState.error).toBe(null);
          });
        
        it('fulfilled', () => {
              const orders: TOrder[] = [
                {
                  _id: "1",
                  name: "Order 1",
                  status: "done", 
                  createdAt: "2024-10-23T12:00:00Z", 
                  updatedAt: "2024-10-23T12:00:00Z", 
                  number: 1,
                  ingredients: ["ingredient1", "ingredient2"] 
                },
                {
                  _id: "2",
                  name: "Order 2",
                  status: "pending",
                  createdAt: "2024-10-23T12:00:00Z", 
                  updatedAt: "2024-10-23T12:00:00Z", 
                  number: 2,
                  ingredients: ["ingredient3", "ingredient4"] 
                },
              ];
            
              const newState = reducer(initialState, fetchOrders.fulfilled(orders, ''));
              expect(newState.loading).toBe(false);
              expect(newState.orders).toEqual(orders);
              expect(newState.error).toBe(null);
            });
            
        it('rejected', () => {
            const error = new Error('Failed to fetch orders');
            const newState = reducer(initialState, fetchOrders.rejected(null, '', undefined, error.message));
            
            expect(newState.loading).toBe(false);
            expect(newState.error).toBe(error.message); 
            });
              
    })
  
    describe('should handle fetchOrderByNumber', () => {
        it('pending', () => {
            const newState = reducer(initialState, fetchOrderByNumber.pending('', 1));
            expect(newState.loading).toBe(true);
            expect(newState.error).toBe(null);
          });
          
          it('fulfilled', () => {
            const order: TOrder = {
                _id: "1",
                name: "Order 1",
                status: "done", 
                createdAt: "2024-10-23T12:00:00Z", 
                updatedAt: "2024-10-23T12:00:00Z", 
                number: 1,
                ingredients: ["ingredient1", "ingredient2"] 
              }
        
            const newState = reducer(initialState, fetchOrderByNumber.fulfilled(order, '', 1));
            expect(newState.loading).toBe(false);
            expect(newState.orderDetails).toEqual(order);
            expect(newState.error).toBe(null);
          });
        
          it('rejected', () => {
            const error = new Error('Failed to fetch order');
            const newState = reducer(initialState, fetchOrderByNumber.rejected(null, '', 1, error.message));
            expect(newState.loading).toBe(false);
            expect(newState.error).toBe(error.message);
          });          
    })

    describe('should handle createNewOrder', () => {
        it('pending', () => {
            const newState = reducer(initialState, createNewOrder.pending('', []));
            expect(newState.newOrder.loading).toBe(true);
            expect(newState.newOrder.error).toBe(null);
          });          
        
          it('fulfilled', () => {
            const newOrder: TOrder = {
                _id: "1",
                name: "Order 1",
                status: "done", 
                createdAt: "2024-10-23T12:00:00Z", 
                updatedAt: "2024-10-23T12:00:00Z", 
                number: 1,
                ingredients: ["ingredient1", "ingredient2"] 
              };
        
            const newState = reducer(initialState, createNewOrder.fulfilled(newOrder, '', []));
            expect(newState.newOrder.loading).toBe(false);
            expect(newState.newOrder.orderModalData).toEqual(newOrder);
            expect(newState.newOrder.error).toBe(null);
          });
        
          it('rejected', () => {
            const error = new Error('Failed to create order');
            const newState = reducer(initialState, createNewOrder.rejected(null, '', [], error.message));
            expect(newState.newOrder.loading).toBe(false);
            expect(newState.newOrder.error).toBe(error.message);
          });          
    })
  
    describe('should handle fetchFeeds', () => {
        it('pending', () => {
            const newState = reducer(initialState, fetchFeeds.pending(''));
            expect(newState.loading).toBe(true);
            expect(newState.error).toBe(null);
          });
        
          it('fulfilled', () => {
            const feedData = {
                success: true,
                orders: [],
                total: 10,
                totalToday: 1,
            };
        
            const newState = reducer(initialState, fetchFeeds.fulfilled(feedData, ''));
            expect(newState.loading).toBe(false);
            expect(newState.allOrders).toEqual(feedData);
            expect(newState.error).toBe(null);
          });
        
          it('rejected', () => {
            const error = new Error('Failed to fetch feeds');
            const newState = reducer(initialState, fetchFeeds.rejected(null, '', undefined, error.message));
            expect(newState.loading).toBe(false);
            expect(newState.error).toBe(error.message);
          });
          
    })
  });
  