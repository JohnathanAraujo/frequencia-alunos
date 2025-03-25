// Funções de exibição/ocultação dos formulários
function hideAllForms() {
    document.getElementById('courseForm').style.display = 'none';
    document.getElementById('studentForm').style.display = 'none';
    document.getElementById('attendanceList').style.display = 'none';
}

function showCourseForm() {
    hideAllForms();
    document.getElementById('courseForm').style.display = 'block';
}

function showStudentForm() {
    hideAllForms();
    document.getElementById('studentForm').style.display = 'block';
    updateDisciplineSelect();
}

function showAttendanceList() {
    hideAllForms();
    document.getElementById('attendanceList').style.display = 'block';
    updateAttendanceDisciplineSelect();
}
function showGraficAttence(){
    document.getElementById('graficattence').style.display = 'block';
    graficosAttendance();
}

// Funções de gerenciamento de dados
function saveCourse(event) {
    event.preventDefault();
    const name = document.getElementById('courseName').value;
    const totalClasses = parseInt(document.getElementById('totalClasses').value);
    const requiredAttendance = parseInt(document.getElementById('requiredAttendance').value);

    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    courses.push({
        id: Date.now(),
        name,
        totalClasses,
        requiredAttendance
    });

    localStorage.setItem('courses', JSON.stringify(courses));
    alert('Disciplina cadastrada com sucesso!');
    event.target.reset();
    hideAllForms();
}

function saveStudent(event) {
    event.preventDefault();
    const name = document.getElementById('studentName').value;
    const rgm = document.getElementById('rgm').value;
    const course = document.getElementById('course').value;
    const disciplineId = document.getElementById('discipline').value;

    const students = JSON.parse(localStorage.getItem('students') || '[]');
    students.push({
        id: Date.now(),
        name,
        rgm,
        course,
        disciplineId: parseInt(disciplineId),
        attendances: 0,
        absences: 0
    });

    localStorage.setItem('students', JSON.stringify(students));
    alert('Aluno cadastrado com sucesso!');
    event.target.reset();
    hideAllForms();
}

// Funções de atualização dos selects
function updateDisciplineSelect() {
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const select = document.getElementById('discipline');
    select.innerHTML = '';

    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.id;
        option.textContent = course.name;
        select.appendChild(option);
    });
}

function updateAttendanceDisciplineSelect() {
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const select = document.getElementById('attendanceDiscipline');
    select.innerHTML = '';

    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.id;
        option.textContent = course.name;
        select.appendChild(option);
    });

    loadStudentsByDiscipline();
}

// Função para carregar os alunos por disciplina
function loadStudentsByDiscipline() {
    const disciplineId = parseInt(document.getElementById('attendanceDiscipline').value);
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const course = courses.find(c => c.id === disciplineId);

    const tbody = document.getElementById('studentsTableBody');
    tbody.innerHTML = '';

    const disciplineStudents = students.filter(student => parseInt(student.disciplineId) === disciplineId);

    disciplineStudents.forEach(student => {
        const totalClasses = course.totalClasses;
        const frequency = ((student.attendances / totalClasses) * 100).toFixed(1);
        const isApproved = frequency >= course.requiredAttendance;

        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${student.name}</td>
      <td>${student.rgm}</td>
      <td>${student.attendances}</td>
      <td>${student.absences}</td>
      <td>${frequency}%</td>
      <td><span class="badge ${isApproved ? 'bg-success' : 'bg-danger'}">${isApproved ? 'Aprovado' : 'Reprovado'}</span></td>
      <td>
        <button class="btn btn-sm btn-success me-1" onclick="registerAttendance(${student.id})">Presença</button>
        <button class="btn btn-sm btn-danger me-1" onclick="registerAbsence(${student.id})">Falta</button>
        <button class="btn btn-sm btn-warning" onclick="justifyAbsence(${student.id})">Justificar</button>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

// Funções de gerenciamento de frequência
function registerAttendance(studentId) {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const student = students.find(s => s.id === studentId);
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const course = courses.find(c => c.id === student.disciplineId);  // Encontrar o curso correto do aluno

    if (!student || !course) {
        alert('Aluno ou curso não encontrado!');
        return;
    }

    // Verificar se o aluno tem direito a registrar presença
    if (student.attendances + student.absences < course.totalClasses) {
        student.attendances = (student.attendances || 0) + 1;  // Caso o aluno ainda não tenha frequência registrada
        localStorage.setItem('students', JSON.stringify(students));
        loadStudentsByDiscipline(); // Recarrega a lista de alunos para atualizar as informações
    } else {
        alert('O número máximo de aulas foi atingido para esse aluno.');
    }
}

// Função para registrar falta
function registerAbsence(studentId) {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const student = students.find(s => s.id === studentId);
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const course = courses.find(c => c.id === student.disciplineId);  // Encontrar o curso correto do aluno

    if (!student || !course) {
        alert('Aluno ou curso não encontrado!');
        return;
    }

    // Verificar se o aluno tem direito a registrar falta
    if (student.attendances + student.absences < course.totalClasses) {
        student.absences = (student.absences || 0) + 1;  // Caso o aluno ainda não tenha faltas registradas
        localStorage.setItem('students', JSON.stringify(students));
        loadStudentsByDiscipline(); // Recarrega a lista de alunos para atualizar as informações
    } else {
        alert('O número máximo de aulas foi atingido para esse aluno.');
    }
}

function justifyAbsence(studentId) {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const student = students.find(s => s.id === studentId);
    if (student && student.absences > 0) {
        student.absences--;
        student.attendances++;
        localStorage.setItem('students', JSON.stringify(students));
        loadStudentsByDiscipline();
        alert('Falta justificada com sucesso!');
    } else {
        alert('Não há faltas para justificar.');
    }
}

//Criação de graficos com base nos dados de frequencia das disciplinas
// function graficosAttendance(){
//     const students = JSON.parse(localStorage.getItem('students') || '[]');
//     const student = students.find(s => s.id === studentId);
//     const totalClasses = course.totalClasses;
//     const ctx = document.getElementById('myChart');
//     const disciplineStudents = students.filter(student => parseInt(student.disciplineId) === disciplineId);
//     new Chart(ctx, {
//         type: 'bar',
//         data: {
//         labels: [forEach=student.id],
//         datasets: [{
//             label: 'Cursos',
//             data: [],
//             borderWidth: 1
//         }]
//         },
//         options: {
//         scales: {
//             y: {
//             beginAtZero: true
//             }
//         }
//         }
//     });

// 

let myChart = null; // Variável global para armazenar o gráfico

function graficosAttendance() {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const disciplineId = parseInt(document.getElementById('attendanceDiscipline').value);
    const course = courses.find(c => c.id === disciplineId);

    if (!course) {
        alert("Disciplina não encontrada!");
        return;
    }

    const disciplineStudents = students.filter(student => parseInt(student.disciplineId) === disciplineId);

    if (disciplineStudents.length === 0) {
        alert("Nenhum aluno cadastrado nessa disciplina.");
        return;
    }

    let canvasContainer = document.getElementById('graficattence');

    // Remove qualquer <canvas> existente e cria um novo
    canvasContainer.innerHTML = '<canvas id="myChart"></canvas>';

    const canvas = document.getElementById('myChart');

    if (!canvas) {
        console.error("Erro: Canvas não encontrado!");
        return;
    }

    const ctx = canvas.getContext('2d');

    // 🔥 Verifica se myChart é um objeto válido antes de tentar destruir
    if (myChart instanceof Chart) {
        myChart.destroy();
    }

    // Criando os dados para o gráfico
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: disciplineStudents.map(student => student.name),
            datasets: [
                {
                    label: 'Presenças',
                    data: disciplineStudents.map(student => student.attendances),
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',  // Cor verde para presença
                    borderColor: 'rgba(75, 192, 192, 1)',  // Cor verde para presença
                    borderWidth: 1
                },
                {
                    label: 'Faltas',
                    data: disciplineStudents.map(student => student.absences),
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',  // Cor vermelha para falta
                    borderColor: 'rgba(255, 99, 132, 1)',  // Cor vermelha para falta
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Exibe o gráfico após gerar
    canvasContainer.style.display = 'block';
    // Adiciona botão de fechar o gráfico
    const closeButton = document.createElement('button');
    closeButton.textContent = "Fechar Gráfico";
    closeButton.classList.add('btn', 'btn-danger', 'mt-2');
    closeButton.onclick = function() {
        canvasContainer.style.display = 'none';
    };
    
    canvasContainer.appendChild(closeButton);
}


// Atualiza o gráfico ao mudar a disciplina
document.getElementById('attendanceDiscipline').addEventListener('change', graficosAttendance);



//disciplineStudents.forEach(student => {const totalClasses;const frequency;
//courses.forEach(course => {const option = document.createElement('option');option.value = course.id;option.textContent = course.name;select.appendChild(option);})