/* global app, NAMESPACE, DEFAULT_USER_SETTINGS, FEATURES */
'use strict';

var Tracker = function (namespace, settings) {
  this.storage = new app.Storage(namespace);
  this.config = new app.Config(settings, this.storage);
  this.model = new app.Model(this.config, this.storage);
  this.template = new app.Template(this.config);
  this.view = new app.View(this.template);
  this.controller = new app.Controller(this.model, this.view);
};

var tracker = new Tracker(NAMESPACE, DEFAULT_USER_SETTINGS);

var show = function () {
  tracker.controller.setSection(document.location.hash);
};

var load = function () {
  tracker.controller.setData();
  show();
};

// if (location.protocol === 'http:' && location.hostname !== 'localhost') {
//   const newUrl = location.href.replace('http://', 'https://');
//   tracker.view.render(
//     'warning',
//     `Warning: this app is better loaded from its <a href="${newUrl}">https counterpart</a>`
//   );
// }

window.addEventListener('load', load);
window.addEventListener('hashchange', show);

if (FEATURES.offline) {
  tracker.offline = new app.Offline({
    showOffline: (status) => tracker.view.render('offline', status),
    showInfo: (msg) => tracker.view.render('info', msg),
  });
}
fetch("http://localhost:5000/")
  .then(response => response.json())
  .then(data => {
    console.log("", data);
    console.log("INITIAL Backend Response:", data);
    //document.body.innerHTML = `<h2>Backend says: ${data.message}</h2>`;
  })
  .catch(error => console.error("Error connecting to backend:", error));

  fetch("http://localhost:5000/api/periods")
  .then(response => response.json())
  .then(data => {
    console.log("patients", data);
    localStorage.setItem("patientData", JSON.stringify(data));
   // document.body.innerHTML = `<log-data>${JSON.stringify(data, null, 2)}</log-data>`;
  })
  .catch(error => console.error("Error connecting to backend:", error));

  fetch("http://localhost:5000/api/users")
  .then(response => response.json())
  .then(data => {
    console.log("users", data);
 
    const userSelect = document.getElementById("user-select");

    // Clear existing options
    userSelect.innerHTML = "";

    // Add a default "Select a User" option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select a User";
    userSelect.appendChild(defaultOption);

    // Loop through users and add them to the dropdown
    data.forEach((user) => {
        const option = document.createElement("option");
        option.value = user.id; // Use user ID as the value
        option.textContent = `${user.username} (${user.email})`; // Display username and email
        userSelect.appendChild(option);
    });
  })
  .catch(error => console.error("Error connecting to backend:", error));
