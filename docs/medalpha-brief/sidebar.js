/**
 * MedAlpha Product Brief - Unified Sidebar Navigation
 *
 * This script provides a single source of truth for the sidebar navigation
 * across all pages. It auto-detects the current page and hash to set the
 * active state appropriately.
 */

// Sidebar HTML template
const sidebarHTML = `
  <div class="sidebar-logo">
    <a href="index.html">
      <h1>MedAlpha</h1>
      <span>Product Brief</span>
    </a>
  </div>

  <nav class="sidebar-nav">
    <div class="nav-group">
      <div class="nav-group-title">Overview</div>
      <a href="index.html#vision" class="nav-link" data-page="index" data-hash="vision">Vision</a>
      <a href="index.html#problem" class="nav-link" data-page="index" data-hash="problem">Problem</a>
      <a href="index.html#hypothesis" class="nav-link" data-page="index" data-hash="hypothesis">Hypothesis</a>
      <a href="index.html#assumptions" class="nav-link" data-page="index" data-hash="assumptions">Assumptions</a>
    </div>

    <div class="nav-group">
      <div class="nav-group-title">Users</div>
      <a href="users.html#personas" class="nav-link" data-page="users" data-hash="personas">Personas</a>
      <a href="users.html#journeys" class="nav-link" data-page="users" data-hash="journeys">Journeys</a>
    </div>

    <div class="nav-group">
      <div class="nav-group-title">Product</div>
      <a href="product.html#features" class="nav-link" data-page="product" data-hash="features">Features</a>
      <a href="product.html#feature-matrix" class="nav-link" data-page="product" data-hash="feature-matrix">Feature Matrix</a>
      <a href="product.html#ia-flows" class="nav-link" data-page="product" data-hash="ia-flows">IA and Flows</a>
      <a href="product.html#partners" class="nav-link" data-page="product" data-hash="partners">Partners</a>
    </div>

    <div class="nav-group">
      <div class="nav-group-title">Design</div>
      <a href="design.html#tokens" class="nav-link" data-page="design" data-hash="tokens">Tokens</a>
      <a href="design.html#system" class="nav-link" data-page="design" data-hash="system">System</a>
    </div>

    <div class="nav-group">
      <div class="nav-group-title">Quality</div>
      <a href="quality.html#criteria" class="nav-link" data-page="quality" data-hash="criteria">Criteria</a>
      <a href="quality.html#risks" class="nav-link" data-page="quality" data-hash="risks">Risks</a>
    </div>
  </nav>
`

// Default first hash for each page (used when no hash in URL)
const pageDefaults = {
  index: 'vision',
  users: 'personas',
  product: 'features',
  design: 'tokens',
  quality: 'criteria'
}

/**
 * Get current page name from URL
 * Returns 'index' for root path or index.html
 */
function getCurrentPage() {
  const path = window.location.pathname
  const filename = path.split('/').pop()

  if (!filename || filename === '' || filename === 'index.html') {
    return 'index'
  }

  return filename.replace('.html', '')
}

/**
 * Get current hash from URL (without the # symbol)
 * Returns the default hash for the page if none specified
 */
function getCurrentHash() {
  const hash = window.location.hash.replace('#', '')
  if (hash) return hash

  const page = getCurrentPage()
  return pageDefaults[page] || 'vision'
}

/**
 * Update active state on navigation links
 */
function updateActiveState() {
  const currentPage = getCurrentPage()
  const currentHash = getCurrentHash()

  // Remove active class from all links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active')
  })

  // Find and activate the matching link
  const activeLink = document.querySelector(
    `.nav-link[data-page="${currentPage}"][data-hash="${currentHash}"]`
  )

  if (activeLink) {
    activeLink.classList.add('active')
  } else {
    // Fallback: activate first link for current page
    const fallbackLink = document.querySelector(`.nav-link[data-page="${currentPage}"]`)
    if (fallbackLink) {
      fallbackLink.classList.add('active')
    }
  }
}

/**
 * Initialize sidebar - inject HTML and set up event listeners
 */
function initSidebar() {
  const sidebar = document.getElementById('sidebar')
  if (!sidebar) return

  // Inject sidebar HTML
  sidebar.innerHTML = sidebarHTML

  // Set initial active state
  updateActiveState()

  // Listen for hash changes (in-page navigation)
  window.addEventListener('hashchange', updateActiveState)

  // Mobile: close sidebar when clicking outside
  document.addEventListener('click', function(e) {
    const toggle = document.querySelector('.mobile-menu-toggle')
    if (window.innerWidth <= 768 &&
        !sidebar.contains(e.target) &&
        !toggle.contains(e.target) &&
        sidebar.classList.contains('open')) {
      sidebar.classList.remove('open')
    }
  })
}

/**
 * Toggle mobile sidebar visibility
 */
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open')
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initSidebar)
