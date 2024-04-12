import RegisterForm from "./registerForm";
import colors from "./colors";

const registerForm = new RegisterForm();

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
