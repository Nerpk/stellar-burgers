/// <reference types="cypress" />

describe('Burger Constructor Page', () => {
  beforeEach(() => {
      // Созданы моковые данные для ингредиентов (например, в файле ingredients.json);
      // Настроен перехват запроса на эндпоинт 'api/ingredients’, в ответе на который возвращаются созданные ранее моковые данные.
      cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
      
      cy.intercept('POST', '/api/orders', { fixture: 'order.json' }).as('createOrder');
      localStorage.setItem('user', JSON.stringify({ email: 'test@example.com', name: 'Test User' }));
      cy.setCookie('accessToken', 'mockedAccessToken');
    
      cy.visit('http://localhost:4000/stellar-burgers/');
    });

// Протестировано добавление ингредиента из списка в конструктор. 
  // Минимальные требования — добавление одного ингредиента, в идеале — добавление булок и добавление начинок.
  it('should display ingredients from mocked data', () => {
    cy.wait('@getIngredients').its('response.statusCode').should('eq', 200);
    cy.get('[data-cy="ingredient"]').should('have.length', 3); 
  });

// Протестирована работа модальных окон:
  describe('modal', () => {
    beforeEach(() => {
      cy.wait('@getIngredients');
      cy.get('[data-cy="ingredient"]').first().click();
      cy.get('[data-cy="modal"]').should('exist').and('be.visible');
    });

    // открытие модального окна ингредиента;
    it('should open ingredient modal on ingredient click', () => {
      cy.get('[data-cy="ingredient-name"]').should('contain', 'Краторная булка N-200i'); 
    });
  
    // закрытие по клику на крестик;
    it('should close modal on close button click', () => {
      cy.get('[data-cy="close-modal"]').click();
      cy.get('[data-cy="modal"]').should('not.exist');
    });
  
    // закрытие по клику на оверлей (желательно);
    it('should close modal on overlay click', () => {
      cy.get('[data-cy="modal-overlay"]').click({ force: true });
      cy.get('[data-testid="modal"]').should('not.exist');
    });
  })

// Создание заказа:
  describe('order', () => {
    // Собирается бургер.
    it('should add bun and ingredient to the constructor', () => {
      cy.get('[data-cy="ingredient"]').first().contains('Добавить').click();
      cy.get('[data-cy="constructor"]').find('[data-cy="constructor-bun"]').should('have.length', 2);

      cy.get('[data-cy="ingredient"]').eq(1).contains('Добавить').click();
      cy.get('[data-cy="constructor"]').contains('Филе Люминесцентного тетраодонтимформа');

      cy.get('[data-cy="ingredient"]').eq(1).contains('Добавить').click();
      cy.get('[data-cy="constructor"]')
        .find('*')
        .filter((index, element) => Cypress.$(element).text().trim() === 'Филе Люминесцентного тетраодонтимформа')
        .should('have.length', 2);

      cy.get('[data-cy="ingredient"]').eq(2).contains('Добавить').click();
      cy.get('[data-cy="constructor"]').contains('Соус Spicy-X');
    });

    // Вызывается клик по кнопке «Оформить заказ».
    describe("should click on order button and DON'T open order modal", () =>{
      it('whithout buns', () => {
        cy.get('[data-cy="ingredient"]').eq(1).contains('Добавить').click();
        cy.get('[data-cy="constructor"]').find('[data-cy="constructor-item"]').should('have.length.greaterThan', 0);
        cy.contains('Оформить заказ').click(); 
    
        cy.get('[data-cy="modal"]').should('not.exist');
      });
    
      it('whithout meal', () => {
        cy.get('[data-cy="ingredient"]').first().contains('Добавить').click();
        cy.get('[data-cy="constructor"]').find('[data-cy="constructor-bun"]').should('have.length', 2);
        cy.contains('Оформить заказ').click(); 
    
        cy.get('[data-cy="modal"]').should('not.exist');
      });
    })

    describe('modal order', () => {
      beforeEach(() => {
        cy.get('[data-cy="ingredient"]').first().contains('Добавить').click();
        cy.get('[data-cy="constructor"]').find('[data-cy="constructor-bun"]').should('have.length', 2);
        cy.get('[data-cy="ingredient"]').eq(1).contains('Добавить').click();
        cy.get('[data-cy="constructor"]').find('[data-cy="constructor-item"]').should('have.length.greaterThan', 0);
        cy.contains('Оформить заказ').click(); 

        cy.get('[data-cy="modal"]').should('exist').and('be.visible');
      })
      
      // Проверяется, что модальное окно открылось и номер заказа верный.
      it('should display order number in modal after order is created', () => {
        cy.get('[data-cy="order-number"]').should('contain', '12345');
      });

      // Закрывается модальное окно и проверяется успешность закрытия.
      it('should close modal on close button click', () => {
        cy.get('[data-cy="close-modal"]').click();
        cy.get('[data-cy="modal"]').should('not.exist');
      });

      // Проверяется, что конструктор пуст.
      it('clear constructor after order', () => {
        cy.wait('@createOrder')
        cy.get('[data-cy="close-modal"]').click();

        cy.get('[data-cy="constructor"]').contains('Выберите булки');
        cy.get('[data-cy="constructor"]').contains('Выберите начинку');
      })
    })
  })
});
