const baseUrl = '/api/students';

document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('studentForm');
    const message = document.getElementById('message');
    const studentsList = document.getElementById('studentsList');

    async function loadStudents() {
        try {
            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error('Failed to load students');
            }

            const students = await response.json();

            studentsList.innerHTML = '';

            if (students.length === 0) {
                studentsList.innerHTML = '<li>No students yet.</li>';
                return;
            }

            students.forEach(student => {

                const li = document.createElement('li');

                li.innerHTML = `
                    ${student.rollNumber} - 
                    ${student.firstName} ${student.lastName} - 
                    ${student.email}
                    <button class="delete-btn"
                            onclick="deleteStudent(${student.id})">
                        Delete
                    </button>
                `;

                studentsList.appendChild(li);
            });

        } catch (error) {
            message.textContent = error.message;
        }
    }

    async function addStudent(data) {

        try {
            const response = await fetch(baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.status === 201) {
                message.textContent = 'Student added';
                form.reset();
                await loadStudents();
            } else {
                message.textContent = 'Failed to add student';
            }

        } catch (error) {
            message.textContent = error.message;
        }
    }

    window.deleteStudent = async function(id) {

        try {
            const response = await fetch(`${baseUrl}/${id}`, {
                method: 'DELETE'
            });

            if (response.status === 204) {
                message.textContent = 'Deleted';
                await loadStudents();
            } else {
                message.textContent = 'Failed to delete student';
            }

        } catch (error) {
            message.textContent = error.message;
        }
    };

    form.addEventListener('submit', event => {

        event.preventDefault();

        const formData = new FormData(form);

        const data = {
            rollNumber: formData.get('rollNumber').trim(),
            firstName: formData.get('firstName').trim(),
            lastName: formData.get('lastName').trim(),
            email: formData.get('email').trim()
        };

        addStudent(data);
    });

    loadStudents();
});