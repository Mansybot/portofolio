// Advanced Portfolio JS
// Modul: Theme Toggle, SPA Navigation, GitHub API Integration, Carousel, Modal, dan Service Worker

// ──────────────
// Theme Toggle Module (DeepSeek Mode)
const ThemeModule = (() => {
  const toggleButton = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'light';
  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };
  // Inisialisasi tema
  setTheme(currentTheme);
  toggleButton.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  });
})();

// ──────────────
// SPA Navigation Module (Qwen Mode)
const NavigationModule = (() => {
  const navLinks = document.querySelectorAll('nav ul li a');
  const sections = document.querySelectorAll('main section');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-target');
      sections.forEach(section => {
        if (section.id === targetId) {
          section.classList.add('active');
        } else {
          section.classList.remove('active');
        }
      });
      // Update URL hash tanpa reload
      history.pushState(null, '', `#${targetId}`);
    });
  });
  // Handle back/forward browser
  window.addEventListener('popstate', () => {
    const hash = location.hash.substring(1);
    sections.forEach(section => {
      section.classList.toggle('active', section.id === hash);
    });
  });
})();

// ──────────────
// GitHub Repositories Module (DeepSeek Mode)
// Mengambil data repositori dan render secara dinamis
const GitHubModule = (() => {
  const projectsGrid = document.getElementById('projects-grid');
  const githubUsername = 'your-github-username'; // Ganti dengan username GitHub kamu

  const fetchRepos = async () => {
    try {
      const response = await fetch(`https://api.github.com/users/${githubUsername}/repos`);
      if (!response.ok) throw new Error('Network response was not ok');
      const repos = await response.json();
      renderRepos(repos);
    } catch (error) {
      console.error('Error fetching GitHub repos:', error);
      projectsGrid.innerHTML = '<p>Gagal memuat proyek dari GitHub.</p>';
    }
  };

  const renderRepos = (repos) => {
    projectsGrid.innerHTML = '';
    repos.forEach(repo => {
      const repoElem = document.createElement('div');
      repoElem.classList.add('project-card');
      repoElem.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description ? repo.description : 'Tidak ada deskripsi.'}</p>
        <button class="view-repo" data-repo='${JSON.stringify(repo)}'>Lihat Detail</button>
      `;
      projectsGrid.appendChild(repoElem);
    });
  };

  // Filter proyek berdasarkan input
  const filterInput = document.getElementById('project-filter');
  filterInput.addEventListener('input', () => {
    const filterValue = filterInput.value.toLowerCase();
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      card.style.display = title.includes(filterValue) ? 'block' : 'none';
    });
  });

  // Delegasi event untuk membuka modal dengan detail repositori
  projectsGrid.addEventListener('click', (e) => {
    if (e.target.classList.contains('view-repo')) {
      const repoData = JSON.parse(e.target.getAttribute('data-repo'));
      ModalModule.openModal(generateRepoContent(repoData));
    }
  });

  const generateRepoContent = (repo) => {
    return `
      <h2>${repo.name}</h2>
      <p>${repo.description ? repo.description : 'Tidak ada deskripsi.'}</p>
      <p><strong>Stars:</strong> ${repo.stargazers_count} | <strong>Forks:</strong> ${repo.forks_count}</p>
      <a href="${repo.html_url}" target="_blank" rel="noopener">Kunjungi Repo</a>
    `;
  };

  // Panggil fetchRepos saat inisialisasi
  fetchRepos();

  return { fetchRepos };
})();

// ──────────────
// Carousel Module (Qwen Mode: Optimasi performa & memori)
const CarouselModule = (() => {
  const track = document.querySelector('.carousel-track');
  const items = document.querySelectorAll('.carousel-item');
  const prevButton = document.querySelector('.carousel-btn.prev');
  const nextButton = document.querySelector('.carousel-btn.next');
  let currentIndex = 0;

  const updateCarousel = () => {
    const width = items[0].clientWidth;
    track.style.transform = `translateX(-${currentIndex * width}px)`;
  };

  prevButton.addEventListener('click', () => {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    updateCarousel();
  });

  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % items.length;
    updateCarousel();
  });

  // Opsi auto-play carousel setiap 5 detik
  setInterval(() => {
    nextButton.click();
  }, 5000);
})();

// ──────────────
// Modal Module (Claude Mode: Debugging & Security)
const ModalModule = (() => {
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modal-close');
  const modalBody = document.getElementById('modal-body');

  const openModal = (content) => {
    modalBody.innerHTML = content;
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    modal.setAttribute('aria-hidden', 'true');
    modalBody.innerHTML = '';
  };

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  return { openModal, closeModal };
})();

// ──────────────
// Service Worker Registration untuk caching (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}