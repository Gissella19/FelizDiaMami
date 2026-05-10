const images = [
  {
    file: "images/diaespecial.jpeg",
    caption: "Un dia especial que siempre recordare."
  },
  {
    file: "images/sonrisa.jpeg",
    caption: "Una sonrisa que ilumina todo."
  },
  {
    file: "images/simple.jpeg",
    caption: "Un momento simple y perfecto."
  },
  {
    file: "images/aventura.jpeg",
    caption: "Una aventura compartida."
  },
  {
    file: "images/lugar.jpeg",
    caption: "Un lugar que guarda nuestra historia."
  },
  {
    file: "images/abrazo.jpeg",
    caption: "Un abrazo que no olvido."
  }
];

const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");

const buildGallery = () => {
  gallery.innerHTML = "";
  images.forEach((image) => {
    const item = document.createElement("article");
    item.className = "gallery__item";

    const img = document.createElement("img");
    img.src = image.file;
    img.alt = image.caption || "Recuerdo";

    const caption = document.createElement("p");
    caption.className = "gallery__caption";
    caption.textContent = image.caption;

    item.appendChild(img);
    item.appendChild(caption);

    item.addEventListener("click", () => {
      lightboxImage.src = image.file;
      lightboxImage.alt = image.caption || "Recuerdo";
      lightboxCaption.textContent = image.caption;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
    });

    gallery.appendChild(item);
  });
};

const closeLightbox = () => {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
};

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});


// --- Ventanas tipo "pantalla" ---
const sectionIds = ["#inicio", "#galeria", "#musica", "#carta"];
const allSections = sectionIds.map(id => document.querySelector(id));

function showSection(id) {
  allSections.forEach(sec => {
    if (sec) sec.style.display = "none";
  });
  const s = document.querySelector(id);
  if (s) s.style.display = "";
  // Eliminar cualquier scroll automático
  window.scrollTo(0, 0);
}

// Inicialmente solo mostrar la portada
showSection("#inicio");

document.querySelectorAll("[data-next]").forEach(button => {
  button.addEventListener("click", () => {
    const target = button.getAttribute("data-next");
    showSection(target);
  });
});

buildGallery();

