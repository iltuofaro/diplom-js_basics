"use strict";


// logout
const logoutButton = new LogoutButton();

logoutButton.action = () => {
  ApiConnector.logout((response) => {
    if (response.success) {
      location.reload();
    }
  });
};


// current
const current = ApiConnector.current((response) => {
  if (response.success) {
    ProfileWidget.showProfile(response.data);
  }
});
current;


// RatesBoard
const ratesBoard = new RatesBoard();

function getRates() {
  ApiConnector.getStocks((response) => {
    if (response.success) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(response.data);
    }
  });
}

getRates();
setInterval(getRates, 60000);


// MoneyManager
const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = (data) => {
  ApiConnector.addMoney(data, (response) => {
    if (response.success) {
      moneyManager.setMessage(
        false,
        `Баланс пополнен на ${data.amount} ${data.currency}`
      );
      ProfileWidget.showProfile(response.data);
      return;
    }

    moneyManager.setMessage(true, response.data);
  });
};

moneyManager.conversionMoneyCallback = (data) => {
  ApiConnector.convertMoney(data, (response) => {
    if (response.success) {
      moneyManager.setMessage(false, `Конвертация выполнена`);
      ProfileWidget.showProfile(response.data);
      return;
    }

    moneyManager.setMessage(true, response.data);
  });
};

moneyManager.sendMoneyCallback = (data) => {
  ApiConnector.transferMoney(data, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(
        false,
        `Вы успешно перевели ${data.amount} ${data.currency}`
      );
      return;
    }

    moneyManager.setMessage(true, response.data);
  });
};


// FavoritesWidget
const favoritesWidget = new FavoritesWidget();

function updateFavorit() {
  ApiConnector.getFavorites((response) => {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
    }
  });
}

updateFavorit();

favoritesWidget.addUserCallback = (data) => {
  ApiConnector.addUserToFavorites(data, (response) => {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      favoritesWidget.setMessage(false, `Пользователь ${data.name} добавлен`);
      return;
    }

    favoritesWidget.setMessage(true, response.data);
  });
};

favoritesWidget.removeUserCallback = (data) => {
  ApiConnector.removeUserFromFavorites(data, (response) => {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      favoritesWidget.setMessage(false, `Пользователь удален`);
    }
  });
};