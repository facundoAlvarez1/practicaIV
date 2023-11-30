const apiUrl = 'https://utn-lubnan-api-2.herokuapp.com/api';

function getEmployees() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${apiUrl}/Employee`, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const employees = JSON.parse(xhr.responseText);
                    resolve(employees);
                } else {
                    reject(new Error('Could not get the list of employees'));
                }
            }
        };
        xhr.send();
    });
}

getEmployees()
    .then(employees => {
        console.log('Empleados recibidos:', employees);
    })
    .catch(error => {
        console.error('Error al obtener la lista de empleados:', error);
    });




function getCompanies() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${apiUrl}/Company`, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const companies = JSON.parse(xhr.responseText);
                    resolve(companies);
                } else {
                    reject(new Error('Could not get the list of companies'));
                }
            }
        };
        xhr.send();
    });
}

getCompanies()
    .then(companies => {
        console.log('Compañías recibidas:', companies);
    })
    .catch(error => {
        console.error('Error al obtener la lista de empresas:', error);
    });



function deleteEmployee(employeeId) {
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', `${apiUrl}/Employee/${employeeId}`, true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            updateTable();
        } else {
            console.error('Error al eliminar al empleado');
        }
    };

    xhr.onerror = function () {
        console.error('Error al eliminar al empleado');
    };

    xhr.send();
}

function updateTable() {
    Promise.all([getEmployees(), getCompanies()])
        .then(([employees, companies]) => {
            const table = document.querySelector('.table tbody');
            table.innerHTML = '';

    /*            const filterEmployees = employees.filter(employee => {
                return employee.companyId !== null && employee.firstName.startsWith('J');
            });
*/

          /*  const filterEmployees = employees.sort((a, b) => a.lastName.localeCompare(b.lastName));*/

            /* const filterEmployees = employees.filter(employee => {
                      return employee.companyId !== null && employee.employeeId % 2 === 0;
                  }); FILTRAR CON ID PAR*/


            /* employees.sort((a, b) => b.id - a.id);//ordenar por id*/

            
            const filterEmployees = employees.filter(employee => {
                return employee.companyId !== null && employee.email.includes('google');
            });


            filterEmployees.forEach((employee, index) => {
                const company = companies.find(c => c.companyId === employee.companyId);
                const companyName = company ? company.name : '';
                const newRow = `
          <tr>
            <th scope="row">${index + 1}</th>
            <td>${companyName}</td>
            <td>${employee.lastName}</td>
            <td>${employee.firstName}</td>
            <td>${employee.email}</td>
            <td><button type="button" class="btn btn-danger btn-sm" data-employee-id="${employee.employeeId}">Delete</button></td>
          </tr>
        `;

                table.insertAdjacentHTML('beforeend', newRow);

                const deleteButton = table.querySelector(`[data-employee-id="${employee.employeeId}"]`);
                deleteButton.addEventListener('click', () => {
                    deleteEmployee(employee.employeeId);
                });
            });
        })
        .catch(error => {
            console.error('Error al actualizar la tabla:', error);
        });
}

updateTable();
