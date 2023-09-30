// URL de la API que deseas consumir
const baseUrl = "http://127.0.0.1:8000";

const tablaFoundations = document.getElementById("table-foundations");
const tbody = tablaFoundations.querySelector("tbody");

fetch(baseUrl + "/foundations/api/v1/foundations/")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((item) => {
      addRow(item);
    });
  })
  .catch((error) => {
    console.error("Error al cargar los datos:", error);
  });

function editElemento(item) {
  $("#modalShow").modal("show");

  const form = `<input type="hidden" name="id" value="${item.id}">
                <div class="col-md-6">
                    <label class="form-label">Name</label>
                    <input type="text" class="form-control" name="name" value="${item.name}">
                </div>
                <div class="col-6">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" name="email" value="${item.email}">
                </div>
                <div class="col-md-12">
                    <div class="form-floating">
                        <textarea class="form-control" name="introduction">${item.introduction}</textarea>
                        <label for="floatingTextarea">Introduction</label>
                    </div>
                </div>
                <div class="col-12">
                    <div class="form-floating">
                        <textarea class="form-control" name="history">${item.history}</textarea>
                        <label for="floatingTextarea">History</label>
                    </div>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Nit</label>
                    <input type="text" class="form-control" name="nit" value="${item.nit}">
                </div>
                <div class="col-md-6">
                    <label class="form-label">Phone</label>
                    <input type="tel" class="form-control" name="phone" value="${item.phone}">
                </div>
                <div class="col-md-6">
                    <label class="form-label">Web Site</label>
                    <input type="text" class="form-control" name="webSite" value="${item.webSite}">
                </div>
                <div class="col-md-6">
                    <label class="form-label">Founding Date</label>
                    <input type="date" class="form-control" name="foundationFoundingDate" value="${item.foundationFoundingDate}">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Employee Count</label>
                    <input type="number" class="form-control" name="employeeCount" value="${item.employeeCount}">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Animals Assisted Count</label>
                    <input type="number" class="form-control" name="animalsAssistedCount" value="${item.animalsAssistedCount}">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Current Animals Assisted Count</label>
                    <input type="number" class="form-control" name="currentAnimalsAssistedCount" value="${item.currentAnimalsAssistedCount}">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Limit Animals Assisted Count</label>
                    <input type="number" class="form-control" name="limitAnimalsAssistedCount" value="${item.limitAnimalsAssistedCount}">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Foundation Rating</label>
                    <input type="number" class="form-control" name="foundationRating" value="${item.foundationRating}">
                </div>
                <div class="col-12">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary">Update</button>
                </div>
                `;

  $("#modalShow").find("form").html(form);
}

function deleteElemento(id, row) {
  fetch(baseUrl + `/foundations/api/v1/foundations/${id}/`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        alert("Eliminado con éxito");
      } else {
        alert("Hubo un problema eliminar");
      }
    })
    .catch((error) => {
      console.error("Error eliminar:", error);
    });
  tbody.removeChild(row);
}

$("#modalShow").on("hidden.bs.modal", function () {
  $(this).find("form").empty();
});

$("#formUpdate").on("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  const id = formData.get("id");
  fetch(baseUrl + `/foundations/api/v1/foundations/${id}/`, {
    method: "PUT",
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        $("#modalShow").modal("hide");
        alert("Formulario enviado con éxito");
        return response.json();
      } else {
        alert("Hubo un problema al enviar el formulario");
      }
    })
    .then((data) => {
      const row = $(tablaFoundations)
        .find("tbody tr")
        .filter(function () {
          return parseInt($(this).find("td:first").text()) == id;
        });
      if (row.length != 1) {
        throw new Error("Error al actualizar la tabla,refresca la página.");
      } else {
        const index = row.index();
        row.remove();
        addRow(data, index);
      }
    })
    .catch((error) => {
      console.error("Error al enviar el formulario:", error);
    });
});

$("#formAdd").on("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  fetch(baseUrl + `/foundations/api/v1/foundations/`, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        alert("Formulario enviado con éxito");
        return response.json();
      } else {
        alert("Hubo un problema al enviar el formulario");
      }
    })
    .then((data) => {
      addRow(data);
      cleanForm();
    })
    .catch((error) => {
      console.error("Error al enviar el formulario:", error);
    });
});
function cleanForm() {
  $("#formAdd").trigger("reset");
}

function addRow(item, index = -1) {
  const row = tbody.insertRow(index);
  const id = row.insertCell(0);
  const nombre = row.insertCell(1);
  const nit = row.insertCell(2);
  const email = row.insertCell(3);
  const phone = row.insertCell(4);
  const actions = row.insertCell(5);

  id.innerHTML = item.id;
  nombre.innerHTML = item.name;
  nit.innerHTML = item.nit;
  email.innerHTML = item.email;
  phone.innerHTML = item.phone;

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.classList.add("btn", "btn-warning", "btn-sm");
  editButton.addEventListener("click", () => editElemento(item));

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("btn", "btn-danger", "btn-sm", "ms-2");
  deleteButton.addEventListener("click", () => deleteElemento(item.id, row));

  actions.appendChild(editButton);
  actions.appendChild(deleteButton);
}
