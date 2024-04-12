import colors from "./colors";

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

export default RegisterForm;
