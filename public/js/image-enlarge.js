let overlay
let currentImageIndex = -1
let allImages = []
let touchStartX = 0

document.addEventListener('touchstart', (e) => {
  if (overlay) touchStartX = e.touches[0].clientX
})

document.addEventListener('touchend', (e) => {
  if (!overlay) return
  const touchEndX = e.changedTouches[0].clientX
  const diff = touchStartX - touchEndX
  if (Math.abs(diff) > 50) {
    e.preventDefault()
    navigateImage(diff > 0 ? 1 : -1)
  }
})

function createImageOverlay(popupImage) {
  allImages = Array.from(document.querySelectorAll('img'))
  currentImageIndex = allImages.indexOf(popupImage)
  overlay = document.createElement('div')
  overlay.classList.add(
    'fixed',
    'inset-0',
    'bg-black',
    'bg-opacity-80',
    'z-50',
    'flex',
    'items-center',
    'justify-center',
    'transition-opacity',
    'duration-300',
    'ease-in-out',
    'opacity-0'
  )

  const closeButton = document.createElement('button')
  closeButton.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8" role="img" aria-label="Close Icon"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>`
  closeButton.setAttribute('aria-label', 'Close image viewer')
  closeButton.setAttribute('type', 'button')
  closeButton.setAttribute('title', 'ESC to close')
  closeButton.classList.add(
    'absolute',
    'top-4',
    'right-4',
    'p-2',
    'hover:bg-white/30',
    'rounded-full',
    'transition-colors'
  )
  closeButton.addEventListener('click', closeOverlay)

  const prevButton = document.createElement('button')
  prevButton.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8" role="img" aria-label="Previous"><path d="M15 18l-6-6 6-6"></path></svg>`
  prevButton.setAttribute('aria-label', 'Previous image')
  prevButton.setAttribute('type', 'button')
  prevButton.setAttribute('title', 'Previous image')
  prevButton.classList.add(
    'absolute',
    'top-16',
    'right-4',
    'p-2',
    'hover:bg-white/30',
    'rounded-full',
    'transition-colors'
  )
  prevButton.addEventListener('click', (e) => {
    e.stopPropagation()
    navigateImage(-1)
  })

  const nextButton = document.createElement('button')
  nextButton.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8" role="img" aria-label="Next"><path d="M9 18l6-6-6-6"></path></svg>`
  nextButton.setAttribute('aria-label', 'Next image')
  nextButton.setAttribute('type', 'button')
  nextButton.setAttribute('title', 'Next image')
  nextButton.classList.add(
    'absolute',
    'top-28',
    'right-4',
    'p-2',
    'hover:bg-white/30',
    'rounded-full',
    'transition-colors'
  )
  nextButton.addEventListener('click', (e) => {
    e.stopPropagation()
    navigateImage(1)
  })

  const enlargedImg = popupImage.cloneNode()
  enlargedImg.classList.remove('hidden')
  enlargedImg.classList.add(
    'enlarged-image',
    'max-w-[96vw]',
    'max-h-[96vh]',
    'object-contain',
    'animate-pop-in',
    'rounded-md'
  )
  enlargedImg.setAttribute('title', 'ESC to close')

  overlay.appendChild(enlargedImg)
  overlay.appendChild(closeButton)
  overlay.appendChild(prevButton)
  overlay.appendChild(nextButton)
  document.body.appendChild(overlay)
  // Trigger reflow to ensure the transition applies
  overlay.offsetHeight
  overlay.classList.remove('opacity-0')
}

document.addEventListener('click', function (event) {
  if (overlay) {
    event.preventDefault()
    closeOverlay()
    return
  }

  if (event.target.tagName === 'IMG') {
    event.preventDefault()
    createImageOverlay(event.target)
  }
})

function navigateImage(direction) {
  if (!overlay || allImages.length === 0) return
  currentImageIndex = (currentImageIndex + direction + allImages.length) % allImages.length
  const enlargedImg = overlay.querySelector('.enlarged-image')
  enlargedImg.src = allImages[currentImageIndex].src
  enlargedImg.alt = allImages[currentImageIndex].alt
}

document.addEventListener('keydown', function (event) {
  if (overlay) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      navigateImage(-1)
      return
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      navigateImage(1)
      return
    }
    event.preventDefault()
    closeOverlay()
    return
  }

  if ((event.key === 'Enter' || event.key === ' ') && document.activeElement.tagName === 'IMG') {
    event.preventDefault()
    createImageOverlay(document.activeElement)
  }
})

function closeOverlay() {
  const enlargedImg = overlay.querySelector('.enlarged-image')
  enlargedImg.classList.remove('animate-pop-in')
  enlargedImg.classList.add('animate-pop-out')
  overlay.classList.add('opacity-0')

  overlay.addEventListener(
    'transitionend',
    function () {
      document.body.removeChild(overlay)
      overlay = null
    },
    { once: true }
  )
}
