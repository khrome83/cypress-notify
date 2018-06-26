// Default Settings
const actions = {
  default: {

  },
};

const notify = (action = 'default', payload = {}) => {
  console.log('Notification!');

  cy.exec(`cypress-notify-request --path ${item}`);
}

module.exports = (userActions) => {
  Object.assign(actions, userActions);

  Cypress.Commands.add('notify', notify);
};
