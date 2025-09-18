document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('artSubmissionForm');
  const emailInput = document.getElementById('email');
  const titleInput = document.getElementById('title');
  const descriptionInput = document.getElementById('description');
  const tagInput = document.getElementById('tagInput');
  const tagWrapper = document.getElementById('tagWrapper');
  const tagsHiddenInput = document.getElementById('tags');
  const uploadArea = document.getElementById('uploadArea');
  const fileInput = document.getElementById('artwork');
  const previewContainer = document.getElementById('previewContainer');
  const imagePreview = document.getElementById('imagePreview');
  const removeFileBtn = document.getElementById('removeFile');
  const submitBtn = document.querySelector('.submit-btn');
  const tagSuggestions = document.querySelectorAll('.tag-suggestion');
  const charCount = document.getElementById('charCount');
  const successModal = document.getElementById('successModal');
  const closeModal = document.getElementById('closeModal');
  
  const emailError = document.getElementById('emailError');
  const titleError = document.getElementById('titleError');
  const descriptionError = document.getElementById('descriptionError');
  const tagsError = document.getElementById('tagsError');
  const artworkError = document.getElementById('artworkError');
  const aiGeneratedError = document.getElementById('aiGeneratedError');
  const termsError = document.getElementById('termsError');
  
  let tags = [];
  
  const MAX_CHARS = 500;
  
  descriptionInput.addEventListener('input', function() {
    const remaining = MAX_CHARS - this.value.length;
    charCount.textContent = this.value.length;
    
    if (remaining < 0) {
      charCount.parentElement.classList.add('limit-reached');
      this.value = this.value.substring(0, MAX_CHARS);
      charCount.textContent = MAX_CHARS;
    } else {
      charCount.parentElement.classList.remove('limit-reached');
    }
  });
  
  uploadArea.addEventListener('click', function() {
    fileInput.click();
  });
  
  uploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.classList.add('drag-over');
  });
  
  uploadArea.addEventListener('dragleave', function() {
    this.classList.remove('drag-over');
  });
  
  uploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      handleFileSelect();
    }
  });
  
  fileInput.addEventListener('change', handleFileSelect);
  
  function handleFileSelect() {
    const file = fileInput.files[0];

    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        showError(fileInput.parentElement.parentElement, artworkError, 'Please select a valid image file (JPG, PNG, or GIF)');
        previewContainer.style.display = 'none';
        removeFileBtn.style.display = 'none';
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        showError(fileInput.parentElement.parentElement, artworkError, 'File size should be less than 10MB');
        previewContainer.style.display = 'none';
        removeFileBtn.style.display = 'none';
        return;
      }

      const reader = new FileReader();
      reader.onload = function(e) {
        imagePreview.src = e.target.result;
        previewContainer.style.display = 'block';
        removeFileBtn.style.display = 'flex';
      }
      reader.readAsDataURL(file);
    } else {
      previewContainer.style.display = 'none';
      removeFileBtn.style.display = 'none';
    }
  }
  
  removeFileBtn.addEventListener('click', function() {
    fileInput.value = '';
    imagePreview.src = '';
    previewContainer.style.display = 'none';
    removeFileBtn.style.display = 'none';
  });
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    clearErrors();

    if (!validateEmail(emailInput.value)) {
      showError(emailInput, emailError, 'Please enter a valid email address');
    }

    if (titleInput.value.trim() === '') {
      showError(titleInput, titleError, 'Title is required');
    }

    if (descriptionInput.value.trim() === '') {
      showError(descriptionInput, descriptionError, 'Description is required');
    }

    if (tags.length === 0) {
      showError(tagInput, tagsError, 'At least one tag is required');
    }

    if (fileInput.files.length === 0) {
      showError(fileInput.parentElement.parentElement, artworkError, 'Artwork file is required');
    }

    const aiYes = document.getElementById('aiYes');
    const aiNo = document.getElementById('aiNo');
    if (!(aiYes.checked || aiNo.checked)) {
      showError(aiYes.parentElement.parentElement, aiGeneratedError, 'Please select if this is AI-generated');
    }

    const termsCheckbox = document.getElementById('termsAgreement');
    if (!termsCheckbox.checked) {
      showError(termsCheckbox.parentElement, termsError, 'You must accept the terms and conditions');
    }

    const hasError = Array.from(document.querySelectorAll('.error-message')).some(el => !el.classList.contains('hidden') && el.textContent.trim() !== '');
    if (!hasError) {
      window.location.href = "success.html";
    }
  });
  
  closeModal.addEventListener('click', function() {
    successModal.classList.add('hidden');
    form.reset();
    tags = [];
    renderTags();
    updateTagsInput();
  });
  
  tagInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && tagInput.value.trim() !== '') {
      e.preventDefault();
      addTag(tagInput.value.trim());
      tagInput.value = '';
    }
  });
  
  tagSuggestions.forEach(btn => {
    btn.addEventListener('click', function() {
      addTag(this.textContent.trim());
    });
  });
  
  function addTag(tag) {
    if (!tag || tags.includes(tag)) return;
    tags.push(tag);
    renderTags();
    updateTagsInput();
  }
  
  function removeTag(tag) {
    tags = tags.filter(t => t !== tag);
    renderTags();
    updateTagsInput();
  }
  
  function renderTags() {
    tagWrapper.innerHTML = '';
    tags.forEach(tag => {
      const tagEl = document.createElement('span');
      tagEl.className = 'tag';
      tagEl.textContent = tag;
      const removeBtn = document.createElement('span');
      removeBtn.className = 'tag-remove';
      removeBtn.innerHTML = '&times;';
      removeBtn.title = 'Remove tag';
      removeBtn.addEventListener('click', function() {
        removeTag(tag);
      });
      tagEl.appendChild(removeBtn);
      tagWrapper.appendChild(tagEl);
    });
  }
  
  function updateTagsInput() {
    tagsHiddenInput.value = tags.join(',');
  }
  
  form.addEventListener('reset', function() {
    setTimeout(() => {
      tags = [];
      renderTags();
      updateTagsInput();
    }, 0);
  });
  
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
  
  function showError(input, errorElement, message) {
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
    input.classList.add('error');
  }
  
  function clearErrors() {
    form.querySelectorAll('.error').forEach(el => {
      el.classList.add('hidden');
      el.textContent = '';
    });
    form.querySelectorAll('.form-control').forEach(input => {
      input.classList.remove('error');
    });
  }
});