/// <reference types="cypress" />

const ingredient = '[data-cy="ingredient"]'
const ingredient_name = '[data-cy="ingredient-name"]'

const modal = '[data-cy="modal"]'
const close_modal = '[data-cy="close-modal"]'
const modal_overlay = '[data-cy="modal-overlay"]'

const order_number = '[data-cy="order-number"]'
const order_number_text = '12345'

const constructor = '[data-cy="constructor"]'
const constructor_bun = '[data-cy="constructor-bun"]'
const constructor_item = '[data-cy="constructor-item"]'

const order_button_text = 'Оформить заказ'
const add_button_text = 'Добавить'

const bun_name = 'Краторная булка N-200i'
const meal_name = 'Филе Люминесцентного тетраодонтимформа'
const souse_name = 'Соус Spicy-X'

describe('Burger Constructor Page', () => {
  beforeEach(() => {
      // Созданы моковые данные для ингредиентов (например, в файле ingredients.json);
      // Настроен перехват запроса на эндпоинт 'api/ingredients’, в ответе на который возвращаются созданные ранее моковые данные.
      cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
      
      cy.intercept('POST', '/api/orders', { fixture: 'order.json' }).as('createOrder');
      localStorage.setItem('user', JSON.stringify({ email: 'test@example.com', name: 'Test User' }));
      cy.setCookie('accessToken', 'mockedAccessToken');
    
      cy.visit('/');
    });

// Протестировано добавление ингредиента из списка в конструктор. 
  // Минимальные требования — добавление одного ингредиента, в идеале — добавление булок и добавление начинок.
  it('should display ingredients from mocked data', () => {
    cy.wait('@getIngredients').its('response.statusCode').should('eq', 200);
    cy.get(ingredient).should('have.length', 3); 
  });

// Протестирована работа модальных окон:
  describe('modal', () => {
    beforeEach(() => {
      cy.wait('@getIngredients');
      cy.get(ingredient).first().click();
      cy.get(modal).should('exist').and('be.visible');
    });

    // открытие модального окна ингредиента;
    it('should open ingredient modal on ingredient click', () => {
      cy.get(ingredient_name).should('contain', bun_name); 
    });
  
    // закрытие по клику на крестик;
    it('should close modal on close button click', () => {
      cy.get(close_modal).click();
      cy.get(modal).should('not.exist');
    });
  
    // закрытие по клику на оверлей (желательно);
    it('should close modal on overlay click', () => {
      cy.get(modal_overlay).click({ force: true });
      cy.get(modal).should('not.exist');
    });
  })

// Создание заказа:
  describe('order', () => {
    // Собирается бургер.
    it('should add bun and ingredient to the constructor', () => {
      cy.get(ingredient).first().contains(add_button_text).click();
      cy.get(constructor).find(constructor_bun).should('have.length', 2);

      cy.get(ingredient).eq(1).contains(add_button_text).click();
      cy.get(constructor).contains(meal_name);

      cy.get(ingredient).eq(1).contains(add_button_text).click();
      cy.get(constructor)
        .find('*')
        .filter((index, element) => Cypress.$(element).text().trim() === meal_name)
        .should('have.length', 2);

      cy.get(ingredient).eq(2).contains(add_button_text).click();
      cy.get(constructor).contains(souse_name);
    });

    // Вызывается клик по кнопке «Оформить заказ».
    describe("should click on order button and DON'T open order modal", () =>{
      it('whithout buns', () => {
        cy.get(ingredient).eq(1).contains(add_button_text).click();
        cy.get(constructor).find(constructor_item).should('have.length.greaterThan', 0);
        cy.contains(order_button_text).click(); 
    
        cy.get(modal).should('not.exist');
      });
    
      it('whithout meal', () => {
        cy.get(ingredient).first().contains(add_button_text).click();
        cy.get(constructor).find(constructor_bun).should('have.length', 2);
        cy.contains(order_button_text).click(); 
    
        cy.get(modal).should('not.exist');
      });
    })

    describe('modal order', () => {
      beforeEach(() => {
        cy.get(ingredient).first().contains(add_button_text).click();
        cy.get(constructor).find(constructor_bun).should('have.length', 2);
        cy.get(ingredient).eq(1).contains(add_button_text).click();
        cy.get(constructor).find(constructor_item).should('have.length.greaterThan', 0);
        cy.contains(order_button_text).click(); 

        cy.get(modal).should('exist').and('be.visible');
      })
      
      // Проверяется, что модальное окно открылось и номер заказа верный.
      it('should display order number in modal after order is created', () => {
        cy.get(order_number).should('contain', order_number_text);
      });

      // Закрывается модальное окно и проверяется успешность закрытия.
      it('should close modal on close button click', () => {
        cy.get(close_modal).click();
        cy.get(modal).should('not.exist');
      });

      // Проверяется, что конструктор пуст.
      it('clear constructor after order', () => {
        cy.wait('@createOrder')
        cy.get(close_modal).click();

        cy.get(constructor).contains('Выберите булки');
        cy.get(constructor).contains('Выберите начинку');
      })
    })
  })
});
