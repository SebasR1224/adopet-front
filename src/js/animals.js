// URL de la API que deseas consumir
const baseUrl = "http://127.0.0.1:8000";

const tablaAnimals = document.getElementById("table-animals");
const tbody = tablaAnimals.querySelector("tbody");

fetch(baseUrl + "/animals/api/v1/animals/")
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
  item.rescueDate = item.rescueDate.slice(0, 16);
  $("#modalShow").modal("show");

  const form = `
              <input type="hidden" name="id" value="${item.id}">
                <div class="col-md-6">
                    <label class="form-label">Name</label>
                    <input type="text" class="form-control" name="nombre" value="${
                      item.nombre
                    }">
                </div>
                <div class="col-md-6">
                    <label class="form-label">Age</label>
                    <input type="number" class="form-control" name="age" value="${
                      item.age
                    }">
                </div>
                <div class="col-md-4">
                    <label class="form-label">Coat Color</label>
                    <input type="text" class="form-control" name="coatColor" value="${
                      item.coatColor
                    }">
                </div>
                <div class="col-md-4">
                    <label class="form-label">Weight</label>
                    <input type="number" class="form-control" name="weight" value="${
                      item.weight
                    }">
                </div>
                <div class="col-md-4">
                    <label class="form-label">Height</label>
                    <input type="number" class="form-control" name="height" value="${
                      item.height
                    }">
                </div>
                <div class="col-md-4">
                    <label class="form-label">Breed Or Type</label>
                    <input type="text" class="form-control" name="breedortype" value="${
                      item.breedortype
                    }">
                </div>
                <div class="col-md-4">
                    <label class="form-label">Rescue Date</label>
                    <input type="datetime-local" step="1" class="form-control" name="rescueDate" value="${
                      item.rescueDate
                    }">
                </div>
                <div class="col-md-4">
                    <label class="form-label">Rescue Place</label>
                    <input type="text" class="form-control" name="rescuePlace" value="${
                      item.rescuePlace
                    }">
                </div>
                <div class="col-md-12">
                        <div class="form-floating">
                            <textarea class="form-control" name="rescueStory">${
                              item.rescueStory
                            }</textarea>
                            <label>Rescue Story</label>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="form-floating">
                            <textarea class="form-control" name="healtCondition">${
                              item.healtCondition
                            }</textarea>
                            <label>Health Condition</label>
                        </div>
                    </div>
                <div class="col-12">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="isAdoptable" ${
                          item.isAdoptable && "checked"
                        }>
                        <label class="form-check-label">
                            Is Adoptable
                        </label>
                    </div>
                </div>
                <div class="col-12">
                    <label class="form-label">Status</label>
                    <select class="form-select" aria-label="Default select example" name="status">
                          <option  ${
                            item.status == null && "selected"
                          } >Open this select menu</option>
                          <option  ${
                            item.status == "ABANDONED" && "selected"
                          } value="ABANDONED">Abandoned</option>
                          <option  ${
                            item.status == "SICK" && "selected"
                          } value="SICK">Sick</option>
                          <option  ${
                            item.status == "ADOPTED" && "selected"
                          } value="ADOPTED">Adopted</option>
                          <option  ${
                            item.status == "DEAD" && "selected"
                          } value="DEAD">Dead</option>
                    </select>
                </div>
                <div class="col-12">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary">Update</button>
                </div>
                `;

  $("#modalShow").find("form").html(form);
}

function deleteElemento(id, row) {
  fetch(baseUrl + `/animals/api/v1/animals/${id}/`, {
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
  fetch(baseUrl + `/animals/api/v1/animals/${id}/`, {
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
      const row = $(tablaAnimals)
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
  fetch(baseUrl + `/animals/api/v1/animals/`, {
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
  const age = row.insertCell(2);
  const coatColor = row.insertCell(3);
  const weight = row.insertCell(4);
  const height = row.insertCell(5);
  const breedortype = row.insertCell(6);
  const rescueDate = row.insertCell(7);
  const isAdoptable = row.insertCell(8);
  const status = row.insertCell(9);
  const actions = row.insertCell(10);

  id.innerHTML = item.id;
  nombre.innerHTML = item.nombre;
  age.innerHTML = item.age;
  coatColor.innerHTML = item.coatColor;
  weight.innerHTML = item.weight;
  height.innerHTML = item.height;
  breedortype.innerHTML = item.breedortype;
  rescueDate.innerHTML = item.rescueDate;
  isAdoptable.innerHTML = item.isAdoptable
    ? '<span class="badge text-bg-success">available</span>'
    : '<span class="badge text-bg-danger">not available</span>';
  status.innerHTML = item.status;

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
