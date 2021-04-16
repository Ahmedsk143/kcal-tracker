//Data controller
const StorageCtrl = (function () {
  return {
    StoreItem: function (item) {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem("items"));
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItems: function () {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateItem: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function (item, index) {
        if (updatedItem.id == item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    DeleteItem: function (id) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach(function (item, index) {
        if (id == item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    clearStorage: function () {
      localStorage.removeItem("items");
    },
  };
})();
//Item controller
const ItemCtrl = (function () {
  //Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  //Data structure
  const data = {
    Items: StorageCtrl.getItems(),
    currentItem: null,
    totalCalorie: 0,
  };
  return {
    logData: function () {
      console.log(data);
    },
    getItems: function () {
      return data.Items;
    },
    //This method to create ID and assign it to the item data object with the new id
    addToList: function (name, calorie) {
      let Id;
      if (data.Items.length > 0) {
        Id = data.Items.length + 1;
      } else {
        Id = 1;
      }
      calorie = parseInt(calorie);
      const newItem = new Item(Id, name, calorie);
      data.Items.push(newItem);
      return newItem;
    },
    getTotalNum: function () {
      let total = 0;
      data.Items.forEach(function (item) {
        total += item.calories;
      });
      data.totalCalorie = total;
      return total;
    },
    getItem: function (id) {
      let found = null;
      data.Items.forEach(function (item) {
        if (item.id == id) {
          found = item;
        }
      });
      data.currentItem = found;
      return found;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    updateItem: function (name, calories) {
      calories = parseInt(calories);

      let found;
      data.Items.forEach(function (item) {
        if (item.id == data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    DeleteItem: function (id) {
      const ids = data.Items.map((item) => {
        return item.id;
      });
      const index = ids.indexOf(id);
      data.Items.splice(index, 1);
    },
    clearItems: function () {
      data.Items = [];
    },
  };
})();

//UI Conteroller
const UICtrl = (function () {
  return {
    populateItems: function (items) {
      let html = "";
      items.forEach((item) => {
        html += `
        <tr id="${item.id}">
          <th>${item.id}</th>
          <td>${item.name}</td>
          <td>${item.calories}</td>
          <td>
            <a href="#">
              <i class="edit fas fa-pen-square fa-lg bg-light text-danger"></i
            ></a>
          </td>
        </tr>`;
      });
      document.querySelector("tbody").innerHTML = html;
    },
    AddToListUI: function (item) {
      const tr = document.createElement("tr");
      tr.id = `${item.id}`;
      tr.innerHTML = `
            <th>${item.id}</th>
            <td>${item.name}</td>
            <td>${item.calories}</td>
            <td>
              <a href="#">
                <i class="edit fas fa-pen-square fa-lg bg-light text-danger"></i
              ></a>
            </td>
          `;
      document.querySelector("tbody").insertAdjacentElement("beforeend", tr);
    },
    ClearInput: function () {
      document.querySelector("#name").value = "";
      document.querySelector("#calorie").value = "";
    },
    updateTotal: function (totalNum) {
      document.querySelector("#total").textContent = totalNum;
    },
    initState: function () {
      UICtrl.ClearInput();
      document.querySelector(".add-btn").style.display = "inline-block";
      document.querySelector(".delete-btn").style.display = "none";
      document.querySelector(".update-btn").style.display = "none";
      document.querySelector(".back-btn").style.display = "none";
    },
    clearAddButton: function () {
      document.querySelector(".add-btn").style.display = "none";
      document.querySelector(".delete-btn").style.display = "inline-block";
      document.querySelector(".update-btn").style.display = "inline-block";
      document.querySelector(".back-btn").style.display = "inline-block";
    },
    editedForm: function (item) {
      document.querySelector("#name").value = item.name;
      document.querySelector("#calorie").value = item.calories;
    },
    UpdateItem: function (item) {
      const ID = item.id;
      document.getElementById(`${ID}`).innerHTML = `
      <th>${item.id}</th>
      <td>${item.name}</td>
      <td>${item.calories}</td>
      <td>
        <a href="#">
          <i class="edit fas fa-pen-square fa-lg bg-light text-danger"></i
        ></a>
      </td>
    `;
    },
    DeleteFromList: function (id) {
      document.getElementById(id).remove();
    },
    clearItemsUI: function () {
      document.querySelector("tbody").innerHTML = "";
    },
  };
})();
//App Controller
const App = (function (UICtrl, ItemCtrl) {
  //Event Lisnters
  const loadEvents = function () {
    document.querySelector(".add-btn").addEventListener("click", loadAddEvent);
    document.querySelector(".table").addEventListener("click", loadEditEvent);
    document
      .querySelector(".back-btn")
      .addEventListener("click", loadBackEvent);
  };
  document
    .querySelector(".update-btn")
    .addEventListener("click", loadUpdateEvent);
  document
    .querySelector(".delete-btn")
    .addEventListener("click", loadDeleteEvent);
  //remove default behaiver of Enter key
  document.addEventListener("keypress", (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      return false;
    }
  });
  document.querySelector("#clear-all").addEventListener("click", ClearAll);

  //Event functions
  function loadAddEvent(e) {
    const Name = document.querySelector("#name").value;
    const Calorie = document.querySelector("#calorie").value;
    if (Name !== "" && Calorie !== "") {
      const newItem = ItemCtrl.addToList(Name, Calorie);
      StorageCtrl.StoreItem(newItem);
      UICtrl.AddToListUI(newItem);
      UICtrl.ClearInput();
      UICtrl.updateTotal(ItemCtrl.getTotalNum());
    } else {
      console.log("Invalid input");
    }

    e.preventDefault();
  }
  function loadEditEvent(e) {
    if (e.target.classList.contains("edit")) {
      UICtrl.clearAddButton();
      const itemId = e.target.parentNode.parentNode.parentNode.id;
      const toEditItem = ItemCtrl.getItem(itemId);
      ItemCtrl.setCurrentItem(toEditItem);
      UICtrl.editedForm(toEditItem);
    }
    e.preventDefault();
  }
  function loadBackEvent(e) {
    UICtrl.initState();
    e.preventDefault();
  }
  function loadUpdateEvent(e) {
    const Name = document.querySelector("#name").value;
    const Calories = document.querySelector("#calorie").value;
    const updatedItem = ItemCtrl.updateItem(Name, Calories);
    StorageCtrl.updateItem(updatedItem);
    UICtrl.UpdateItem(updatedItem);
    UICtrl.updateTotal(ItemCtrl.getTotalNum());
    UICtrl.initState();

    e.preventDefault();
  }
  function loadDeleteEvent(e) {
    const currentItem = ItemCtrl.getCurrentItem();
    ItemCtrl.DeleteItem(currentItem.id);
    StorageCtrl.DeleteItem(currentItem.id);
    UICtrl.DeleteFromList(currentItem.id);
    UICtrl.updateTotal(ItemCtrl.getTotalNum());
    UICtrl.initState();
    e.preventDefault();
  }
  function ClearAll(e) {
    ItemCtrl.clearItems();
    StorageCtrl.clearStorage();
    UICtrl.clearItemsUI();
    UICtrl.updateTotal(ItemCtrl.getTotalNum());
    UICtrl.initState();
    e.preventDefault();
  }
  return {
    Init: function () {
      //buttons
      UICtrl.initState();
      //Fetch data from itemctrl
      const items = ItemCtrl.getItems();
      //populate items to ui
      UICtrl.populateItems(items);
      //update calories
      UICtrl.updateTotal(ItemCtrl.getTotalNum());

      //Load Evenets
      loadEvents();
    },
  };
})(UICtrl, ItemCtrl);

App.Init();
