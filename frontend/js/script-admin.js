document.addEventListener("DOMContentLoaded", () => {
  const baseUrl = "http://localhost:3000/passwords"; // Fastify backend URL

  // Navegação entre seções
  document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const sectionId = e.target.dataset.section;
      document.querySelectorAll("main .section").forEach((section) => {
        section.classList.add("hidden");
      });
      document.getElementById(sectionId).classList.remove("hidden");
    });
  });

  // Formulário de Registro
  const passwordForm = document.getElementById("passwordForm");
  passwordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const login = document.getElementById("login").value;
    const password = document.getElementById("password").value;

    try {
      await axios.post(baseUrl, { description, category, login, password });
      alert("Senha registrada com sucesso!");
      passwordForm.reset();
      loadPasswords();
    } catch (error) {
      console.error(error);
      alert("Erro ao registrar senha!");
    }
  });

  // Listar Senhas
  const loadPasswords = async () => {
    try {
      const response = await axios.get(baseUrl);

      // Atualiza tabela de listagem
      const listTbody = document.getElementById("listTable").querySelector("tbody");
      listTbody.innerHTML = "";
      response.data.forEach((password) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${password.id}</td>
          <td>${password.description}</td>
          <td>${password.category}</td>
          <td>${password.login}</td>
          <td>${password.password}</td>
          <td><button data-id="${password.id}" class="delete-btn">Excluir</button></td>
        `;
        listTbody.appendChild(row);
      });

      // Atualiza tabela de edição
      const editTbody = document.getElementById("editTable").querySelector("tbody");
      editTbody.innerHTML = "";
      response.data.forEach((password) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${password.id}</td>
          <td>${password.description}</td>
          <td>${password.category}</td>
          <td>${password.login}</td>
          <td>${password.password}</td>
          <td><button data-id="${password.id}" class="edit-btn">Editar</button></td>
        `;
        editTbody.appendChild(row);
      });

      attachDeleteEvents();
      attachEditEvents();
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar senhas!");
    }
  };

  // Deletar Senha
  const attachDeleteEvents = () => {
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        try {
          await axios.delete(`${baseUrl}/${id}`);
          alert("Senha excluída com sucesso!");
          loadPasswords();
        } catch (error) {
          console.error(error);
          alert("Erro ao excluir senha!");
        }
      });
    });
  };

  // Preencher formulário de edição
  const attachEditEvents = () => {
    document.querySelectorAll(".edit-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        const row = e.target.closest("tr");

        // Preencher o formulário de edição
        document.getElementById("editId").value = id;
        document.getElementById("editDescription").value = row.children[1].innerText;
        document.getElementById("editCategory").value = row.children[2].innerText;
        document.getElementById("editLogin").value = row.children[3].innerText;
        document.getElementById("editPassword").value = row.children[4].innerText;

        // Alternar para a seção de edição
        document.querySelectorAll("main .section").forEach((section) => {
          section.classList.add("hidden");
        });
        document.getElementById("edit").classList.remove("hidden");
      });
    });
  };

  // Salvar alterações no formulário de edição
  const editForm = document.getElementById("editForm");
  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("editId").value;
    const description = document.getElementById("editDescription").value;
    const category = document.getElementById("editCategory").value;
    const login = document.getElementById("editLogin").value;
    const password = document.getElementById("editPassword").value;

    try {
      await axios.put(`${baseUrl}/${id}`, { description, category, login, password });
      alert("Senha atualizada com sucesso!");
      loadPasswords();
      editForm.reset();
      document.getElementById("register").classList.remove("hidden");
      document.getElementById("edit").classList.add("hidden");
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar senha!");
    }
  });

  // Carregar senhas ao iniciar
  loadPasswords();
});
