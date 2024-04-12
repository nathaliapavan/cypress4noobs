class RegisterForm {
  elements = {
    titleInput: () => cy.get("#title"),
    titleFeedback: () => cy.get("#titleFeedback"),
    imageUrlInput: () => cy.get("#imageUrl"),
    urlFeedback: () => cy.get("#urlFeedback"),
    submitBtn: () => cy.get("#btnSubmit"),
  };

  typeTitle(text) {
    if (!text) return;
    this.elements.titleInput().type(text);
  }

  typeUrl(text) {
    if (!text) return;
    this.elements.imageUrlInput().type(text);
  }

  clickSubmit() {
    this.elements.submitBtn().click();
  }

  hitEnter() {
    cy.focused().type("{enter}");
  }

  validateSuccessFeedback(fieldSelector) {
    cy.get(fieldSelector).should(([$input]) => {
      const styles = window.getComputedStyle($input);
      const border = styles.getPropertyValue("border-right-color");
      assert.strictEqual(border, colors.success);
    });
  }

  validateLastFigure(input) {
    cy.get("figure")
      .last()
      .within(() => {
        cy.get("img.card-img-top.card-img").should(
          "have.attr",
          "src",
          input.url
        );
        cy.get("h4.card-title").should("have.text", input.title);
      });
  }

  validateLocalStorageFigure(input) {
    cy.window()
      .its("localStorage")
      .invoke("getItem", "tdd-ew-db")
      .then((storedFigure) => {
        const figure = JSON.parse(storedFigure);
        expect(figure[0].title).to.equal(input.title);
        expect(figure[0].imageUrl).to.equal(input.url);
      });
  }
}

const registerForm = new RegisterForm();

const colors = {
  errors: "rgb(220, 53, 69)",
  success: "rgb(25, 135, 84)",
};

describe("Image Registration", () => {
  describe("Submitting an image with invalid inputs", () => {
    after(() => {
      cy.clearAllLocalStorage();
    });

    const input = {
      title: "",
      url: "",
    };

    it("Given I am on the image registration page", () => {
      cy.visit("/");
    });

    it(`When I enter "${input.title}" in the title field`, () => {
      registerForm.typeTitle(input.title);
    });

    it(`When I enter "${input.url}" in the title field`, () => {
      registerForm.typeUrl(input.url);
    });

    it("Then I click the submit button", () => {
      registerForm.clickSubmit();
    });

    it('Then I should see "Please type a title for the image" message above the title field', () => {
      // registerForm.elements.titleFeedback().should((element) => {
      //   debugger;
      // });
      registerForm.elements
        .titleFeedback()
        .should("contains.text", "Please type a title for the image");
    });

    it('And I should see "Please type a valid URL" message above the imageUrl field', () => {
      registerForm.elements
        .urlFeedback()
        .should("contains.text", "Please type a valid URL");
    });

    it("And I should see an exclamation icon in the title and URL fields", () => {
      registerForm.elements.titleFeedback().should(([element]) => {
        const styles = window.getComputedStyle(element);
        const border = styles.getPropertyValue("border-right-color");
        assert.strictEqual(border, colors.errors);
      });
    });
  });

  describe("Submitting an image with valid inputs using enter key", () => {
    after(() => {
      cy.clearAllLocalStorage();
    });

    const input = {
      title: "Alien BR",
      url: "https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg",
    };

    it("Given I am on the image registration page", () => {
      cy.visit("/");
    });

    it(`When I enter "${input.title}" in the title field`, () => {
      registerForm.clickSubmit();
      registerForm.typeTitle(input.title);
    });

    it("Then I should see a check icon in the title field", () => {
      registerForm.validateSuccessFeedback("#title");
    });

    it(`When I enter "${input.url}" in the title field`, () => {
      registerForm.typeUrl(input.url);
    });

    it("Then I should see a check icon in the imageUrl field", () => {
      registerForm.validateSuccessFeedback("#imageUrl");
    });

    it("Then I can hit enter to submit the form", () => {
      registerForm.hitEnter();
    });

    it("And the list of registered images should be updated with the new item", () => {
      registerForm.validateLastFigure(input);
    });

    it("And the new item should be stored in the localStorage", () => {
      registerForm.validateLocalStorageFigure(input);
    });

    it("Then The inputs should be cleared", () => {
      registerForm.elements.titleInput().should("have.value", "");
      registerForm.elements.imageUrlInput().should("have.value", "");
    });
  });

  describe("Submitting an image and updating the list", () => {
    after(() => {
      cy.clearAllLocalStorage();
    });

    const input = {
      title: "BR Alien",
      url: "https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg",
    };

    it("Given I am on the image registration page", () => {
      cy.visit("/");
    });

    it(`Then I have entered "${input.title}" in the title field`, () => {
      registerForm.typeTitle(input.title);
    });

    it(`Then I have entered "${input.url}" in the title field`, () => {
      registerForm.typeUrl(input.url);
    });

    it("When I click the submit button", () => {
      registerForm.clickSubmit();
    });

    it("And the list of registered images should be updated with the new item", () => {
      registerForm.validateLastFigure(input);
    });

    it("And the new item should be stored in the localStorage", () => {
      registerForm.validateLocalStorageFigure(input);
    });

    it("Then The inputs should be cleared", () => {
      registerForm.elements.titleInput().should("have.value", "");
      registerForm.elements.imageUrlInput().should("have.value", "");
    });
  });

  describe("Refreshing the page after submitting an image clicking in the submit button", () => {
    after(() => {
      cy.clearAllLocalStorage();
    });

    const input = {
      title: "ALIEN BRASIL É DO BRASIL",
      url: "https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg",
    };

    it("Given I am on the image registration page", () => {
      cy.visit("/");
    });

    it("Then I have submitted an image by clicking the submit button", () => {
      registerForm.typeTitle(input.title);
      registerForm.typeUrl(input.url);
      registerForm.clickSubmit();
      cy.wait(100);
    });

    it("When I refresh the page", () => {
      cy.reload();
    });

    it("Then I should still see the submitted image in the list of registered images", () => {
      registerForm.validateLastFigure(input);
      registerForm.validateLocalStorageFigure(input);
    });
  });
});
