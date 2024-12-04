document.addEventListener("DOMContentLoaded", function() {
    // Esconder todas as seções inicialmente
    const sections = document.querySelectorAll("main > section");
    sections.forEach(section => section.style.display = "none");

    // Evento de clique para os links de navegação
    const navLinks = document.querySelectorAll("nav a");
    navLinks.forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            sections.forEach(section => section.style.display = "none");
            const sectionId = this.getAttribute("data-section");
            document.getElementById(sectionId).style.display = "block";
        });
    });
});
