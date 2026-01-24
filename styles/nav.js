document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  const dropdownTriggers = document.querySelectorAll('.nav-item.has-dropdown > .nav-link');
  const isMobile = () => window.innerWidth <= 768;

  // Mobile menu toggle
  if (navToggle && navList) {
    navToggle.addEventListener('click', function() {
      const isOpen = navList.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.textContent = isOpen ? '✕' : '☰';
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navToggle.contains(e.target) && !navList.contains(e.target)) {
        navList.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.textContent = '☰';
      }
    });

    // Close menu when clicking a link (but not dropdown triggers on mobile)
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        // Don't close if this is a dropdown trigger on mobile
        if (isMobile() && this.classList.contains('nav-link') && this.parentElement.classList.contains('has-dropdown')) {
          return;
        }
        navList.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.textContent = '☰';
      });
    });
  }

  // Dropdown functionality for both desktop and mobile
  dropdownTriggers.forEach(trigger => {
    const dropdown = trigger.nextElementSibling;
    const navItem = trigger.parentElement;

    // Click to toggle dropdown
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      // Close all other dropdowns
      dropdownTriggers.forEach(otherTrigger => {
        if (otherTrigger !== this) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          otherTrigger.nextElementSibling.classList.remove('dropdown-open');
        }
      });

      // Toggle current dropdown
      this.setAttribute('aria-expanded', !isExpanded);
      dropdown.classList.toggle('dropdown-open');
    });

    // Keyboard accessibility
    trigger.addEventListener('keydown', function(e) {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        
        // Close all other dropdowns
        dropdownTriggers.forEach(otherTrigger => {
          if (otherTrigger !== this) {
            otherTrigger.setAttribute('aria-expanded', 'false');
            otherTrigger.nextElementSibling.classList.remove('dropdown-open');
          }
        });

        // Toggle current dropdown
        this.setAttribute('aria-expanded', !isExpanded);
        dropdown.classList.toggle('dropdown-open');
      }
      
      // Arrow key navigation
      if (e.key === 'ArrowDown' && isExpanded) {
        e.preventDefault();
        const firstLink = dropdown.querySelector('a');
        if (firstLink) firstLink.focus();
      }
      
      if (e.key === 'Escape') {
        this.setAttribute('aria-expanded', 'false');
        dropdown.classList.remove('dropdown-open');
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!navItem.contains(e.target)) {
        trigger.setAttribute('aria-expanded', 'false');
        dropdown.classList.remove('dropdown-open');
      }
    });
  });

  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      // Clean up desktop-specific classes when switching to mobile
      if (isMobile()) {
        dropdownTriggers.forEach(trigger => {
          trigger.nextElementSibling.classList.remove('dropdown-open');
        });
      }
    }, 250);
  });
});
