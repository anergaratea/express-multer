// Función para actualizar un usuario en la interfaz y en la base de datos
let updateUser = (id) => {
  let row = document.getElementById(id);

  let izena = row.children[1].children[0].value;
  let abizena = row.children[2].children[0].value;
  let email = row.children[3].children[0].value;
  let fileInput = row.children[4].children[0]; // Added this line to get the file input element

  // Create a FormData object to send both text and file data
  let formData = new FormData();
  formData.append('izena', izena);
  formData.append('abizena', abizena);
  formData.append('email', email);
  formData.append('avatar', fileInput.files[0]); // Append the file data

  // Perform the fetch request with the FormData
  fetch(`/users/update/${id}`, {
      method: "PUT",
      body: formData,
  })
  .then((response) => response.json())
  .then((data) => {
      console.log(data);
      window.location.reload(); // Reload the page to see the updated data
  })
  .catch((error) => {
      console.error("Error:", error);
  });
};

  // Función para editar un usuario en la interfaz
  let editUser = (id) => {
      // Get the row corresponding to the ID
      let row = document.getElementById(id);
  
      // Get the current values of the user
      let izena = row.children[1].innerHTML;
      let abizena = row.children[2].innerHTML;
      let email = row.children[3].innerHTML;
  
      // Modifies the row to include editable input fields and a button to save changes
      row.innerHTML = `
        <th scope="row">${id}</th>
        <td><input type="text" id="izena" value="${izena}"></td>
        <td><input type="text" id="abizena" value="${abizena}"></td>
        <td><input type="text" id="email" value="${email}"></td>
        <td><input type="file" name="avatar" id="avatar" accept="image/*"></td>
        <td><input type="button" onclick="updateUser('${id}')" value="Save"></td>
      `;
  };
  
  
// Function to insert a new user in the interface
let insertUser = (user) => {
    // Get the body of the table where new rows will be added
    var tableBody = document.getElementById("userTableBody");

    // Create a new row and set its content based on user data
    var newRow = tableBody.insertRow();
    newRow.setAttribute("id", user._id);

    // Create an img element for the user's profile photo
    var profilePhoto = document.createElement("img");
    profilePhoto.src = `/uploads/${user.file}`;
    profilePhoto.alt = "Profile Photo";
    profilePhoto.width = 50;
    profilePhoto.height = 50;

    newRow.innerHTML = `
      <th scope="row">${user._id}</th>
      <td>${user.izena}</td>
      <td>${user.abizena}</td>
      <td>${user.email}</td>
      <td></td>
    `;

    // Append the profile photo to the row
    newRow.children[4].appendChild(profilePhoto);

    // Create action links for delete and edit
    var actions = document.createElement("td");
    actions.innerHTML = `<a onclick="deleteUser('${user._id}')">[x]</a> <a onclick="editUser('${user._id}')">[e]</a>`;
    newRow.appendChild(actions);

};

  
  // Función para eliminar un usuario de la interfaz y la base de datos
  let deleteUser = (id) => {
    // Realiza una solicitud DELETE para eliminar el usuario de la base de datos
    fetch(`/users/delete/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // maneja la respuesta o realiza acciones necesarias
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  
    // Elimina la fila correspondiente al ID proporcionado en la interfaz
    let row = document.getElementById(id);
    row.parentNode.removeChild(row);
  };
  
  // Listener para manejar el evento 'DOMContentLoaded'
  document.addEventListener("DOMContentLoaded", function () {
    // Listener para manejar el evento 'submit' del formulario de agregar usuarios
    document.getElementById("formularioa").addEventListener("submit", (e) => {
      e.preventDefault();
  
      // Crea un objeto 'user' con los datos del formulario
      let user = {
        izena: e.target.izena.value,
        abizena: e.target.abizena.value,
        id: Date.now(),
        email: e.target.email.value,
        file: e.target.file.value
      };
  
      // Inserta el usuario en la interfaz y realiza una solicitud POST para agregarlo a la base de datos
      insertUser(user);
  
      fetch("/users/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data); // maneja la respuesta o realiza acciones necesarias
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  
    // Realiza una solicitud GET para obtener la lista de usuarios y actualizar la interfaz
    fetch("/users/list")
      .then((r) => r.json())
      .then((users) => {
        console.log(users);
  
        // Itera sobre la lista de usuarios y los agrega a la interfaz
        users.forEach((user) => {
          insertUser(user);
        });
      });
  });