/* ===================================
   PREMIUM BMI CALCULATOR - JAVASCRIPT
   Production Ready Code 2026
   =================================== */

(function () {
  'use strict';

  /* ===================================
     DOM ELEMENTS
     =================================== */
  const elements = {
    // Form & Inputs
    form: document.getElementById('bmiForm'),
    heightInput: document.getElementById('height'),
    weightInput: document.getElementById('weight'),
    heightError: document.getElementById('height-error'),
    weightError: document.getElementById('weight-error'),
    heightUnit: document.getElementById('height-unit'),
    weightUnit: document.getElementById('weight-unit'),

    // Buttons
    calculateBtn: document.getElementById('calculateBtn'),
    resetBtn: document.getElementById('resetBtn'),
    unitBtns: document.querySelectorAll('.unit-btn'),

    // Results
    resultsSection: document.getElementById('resultsSection'),
    bmiValue: document.getElementById('bmiValue'),
    bmiCategory: document.getElementById('bmiCategory'),
    healthyRange: document.getElementById('healthyRange'),
    idealWeight: document.getElementById('idealWeight'),
    adviceText: document.getElementById('adviceText'),
    progressMarker: document.getElementById('progressMarker'),
    scaleIndicator: document.getElementById('scaleIndicator'),

    // Stats Counter
    statValues: document.querySelectorAll('.stat-value[data-count]'),

    // FAQ
    faqQuestions: document.querySelectorAll('.faq-question')
  };

  /* ===================================
     STATE MANAGEMENT
     =================================== */
  let currentUnit = 'metric'; // 'metric' or 'imperial'

  /* ===================================
     BMI CALCULATION LOGIC
     =================================== */
  function calculateBMI(weight, height, unit) {
    let bmi;

    if (unit === 'metric') {
      // BMI = weight (kg) / (height (m))^2
      const heightInMeters = height / 100;
      bmi = weight / (heightInMeters * heightInMeters);
    } else {
      // BMI = (weight (lbs) / (height (in))^2) * 703
      bmi = (weight / (height * height)) * 703;
    }

    return parseFloat(bmi.toFixed(1));
  }

  /* ===================================
     BMI CATEGORY DETERMINATION
     =================================== */
  function getBMICategory(bmi) {
    if (bmi < 18.5) {
      return {
        name: 'Underweight',
        class: 'underweight',
        color: '#60a5fa',
        advice: 'Your BMI indicates that you are underweight. Consider consulting with a healthcare provider or nutritionist to develop a healthy weight gain plan. Focus on nutrient-dense foods and strength training exercises.',
        healthyRange: '18.5 - 24.9'
      };
    } else if (bmi >= 18.5 && bmi < 25) {
      return {
        name: 'Normal Weight',
        class: 'normal',
        color: '#4ade80',
        advice: 'Congratulations! Your BMI is in the healthy range. Maintain your current lifestyle with balanced nutrition and regular physical activity. Keep up the great work!',
        healthyRange: '18.5 - 24.9'
      };
    } else if (bmi >= 25 && bmi < 30) {
      return {
        name: 'Overweight',
        class: 'overweight',
        color: '#facc15',
        advice: 'Your BMI indicates that you are overweight. Consider adopting a balanced diet and increasing physical activity. Small, sustainable changes can make a big difference. Consult a healthcare professional for personalized advice.',
        healthyRange: '18.5 - 24.9'
      };
    } else if (bmi >= 30 && bmi < 35) {
      return {
        name: 'Obesity Class I',
        class: 'obese-1',
        color: '#f87171',
        advice: 'Your BMI indicates Class I obesity. It\'s important to consult with healthcare professionals to create a comprehensive weight management plan. Focus on gradual lifestyle changes including diet, exercise, and behavioral modifications.',
        healthyRange: '18.5 - 24.9'
      };
    } else if (bmi >= 35 && bmi < 40) {
      return {
        name: 'Obesity Class II',
        class: 'obese-2',
        color: '#f87171',
        advice: 'Your BMI indicates Class II obesity. Please consult with healthcare professionals immediately. A structured weight management program with medical supervision may be beneficial. Consider working with a team including doctors, nutritionists, and fitness experts.',
        healthyRange: '18.5 - 24.9'
      };
    } else {
      return {
        name: 'Obesity Class III',
        class: 'obese-3',
        color: '#ef4444',
        advice: 'Your BMI indicates Class III obesity. It\'s crucial to seek immediate medical attention. Work closely with healthcare professionals to develop a comprehensive treatment plan. Multiple interventions may be necessary for effective weight management.',
        healthyRange: '18.5 - 24.9'
      };
    }
  }

  /* ===================================
     IDEAL WEIGHT CALCULATION
     =================================== */
  function calculateIdealWeight(height, unit) {
    let minWeight, maxWeight;

    if (unit === 'metric') {
      const heightInMeters = height / 100;
      minWeight = (18.5 * heightInMeters * heightInMeters).toFixed(1);
      maxWeight = (24.9 * heightInMeters * heightInMeters).toFixed(1);
      return `${minWeight} - ${maxWeight} kg`;
    } else {
      minWeight = ((18.5 * height * height) / 703).toFixed(1);
      maxWeight = ((24.9 * height * height) / 703).toFixed(1);
      return `${minWeight} - ${maxWeight} lbs`;
    }
  }

  /* ===================================
     PROGRESS MARKER POSITION
     =================================== */
  function calculateProgressPosition(bmi) {
    // BMI scale: 15 (0%) to 40 (100%)
    const minBMI = 15;
    const maxBMI = 40;
    
    let percentage;
    
    if (bmi <= minBMI) {
      percentage = 0;
    } else if (bmi >= maxBMI) {
      percentage = 100;
    } else {
      percentage = ((bmi - minBMI) / (maxBMI - minBMI)) * 100;
    }

    return Math.min(Math.max(percentage, 0), 100);
  }

  /* ===================================
     INPUT VALIDATION
     =================================== */
  function validateInput(input, errorElement) {
    const value = parseFloat(input.value);
    const inputName = input.id.charAt(0).toUpperCase() + input.id.slice(1);

    // Clear previous error
    errorElement.textContent = '';
    input.classList.remove('error');

    // Check if empty
    if (!input.value || input.value.trim() === '') {
      errorElement.textContent = `${inputName} is required`;
      input.classList.add('error');
      return false;
    }

    // Check if number
    if (isNaN(value)) {
      errorElement.textContent = `Please enter a valid number`;
      input.classList.add('error');
      return false;
    }

    // Check if positive
    if (value <= 0) {
      errorElement.textContent = `${inputName} must be greater than 0`;
      input.classList.add('error');
      return false;
    }

    // Specific validations
    if (input.id === 'height') {
      if (currentUnit === 'metric') {
        if (value < 50 || value > 300) {
          errorElement.textContent = 'Height must be between 50-300 cm';
          input.classList.add('error');
          return false;
        }
      } else {
        if (value < 20 || value > 120) {
          errorElement.textContent = 'Height must be between 20-120 inches';
          input.classList.add('error');
          return false;
        }
      }
    }

    if (input.id === 'weight') {
      if (currentUnit === 'metric') {
        if (value < 10 || value > 500) {
          errorElement.textContent = 'Weight must be between 10-500 kg';
          input.classList.add('error');
          return false;
        }
      } else {
        if (value < 20 || value > 1100) {
          errorElement.textContent = 'Weight must be between 20-1100 lbs';
          input.classList.add('error');
          return false;
        }
      }
    }

    return true;
  }

  /* ===================================
     VALIDATE ALL INPUTS
     =================================== */
  function validateAllInputs() {
    const heightValid = validateInput(elements.heightInput, elements.heightError);
    const weightValid = validateInput(elements.weightInput, elements.weightError);
    return heightValid && weightValid;
  }

  /* ===================================
     DISPLAY RESULTS
     =================================== */
  function displayResults(bmi, height, weight) {
    const category = getBMICategory(bmi);
    const idealWeight = calculateIdealWeight(height, currentUnit);
    const progressPosition = calculateProgressPosition(bmi);

    // Show results section
    elements.resultsSection.classList.remove('hidden');

    // Animate BMI value with counter
    animateValue(elements.bmiValue, 0, bmi, 1000);

    // Update category
    elements.bmiCategory.textContent = category.name;
    elements.bmiCategory.className = `result-category ${category.class}`;

    // Update scale indicator color
    elements.scaleIndicator.style.color = category.color;

    // Update healthy range
    elements.healthyRange.textContent = category.healthyRange;

    // Update ideal weight
    elements.idealWeight.textContent = idealWeight;

    // Update health advice
    elements.adviceText.textContent = category.advice;

    // Animate progress marker
    setTimeout(() => {
      elements.progressMarker.style.left = `${progressPosition}%`;
      elements.progressMarker.style.background = category.color;
    }, 500);

    // Scroll to results
    setTimeout(() => {
      elements.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 300);
  }

  /* ===================================
     ANIMATE NUMBER COUNTER
     =================================== */
  function animateValue(element, start, end, duration) {
    const startTime = performance.now();
    const isDecimal = end % 1 !== 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * easeOut;

      element.textContent = isDecimal ? current.toFixed(1) : Math.round(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = isDecimal ? end.toFixed(1) : end;
      }
    }

    requestAnimationFrame(update);
  }

  /* ===================================
     HANDLE FORM SUBMISSION
     =================================== */
  function handleFormSubmit(e) {
    e.preventDefault();

    // Validate inputs
    if (!validateAllInputs()) {
      return;
    }

    // Get values
    const height = parseFloat(elements.heightInput.value);
    const weight = parseFloat(elements.weightInput.value);

    // Calculate BMI
    const bmi = calculateBMI(weight, height, currentUnit);

    // Display results
    displayResults(bmi, height, weight);
  }

  /* ===================================
     RESET CALCULATOR
     =================================== */
  function resetCalculator() {
    // Reset form
    elements.form.reset();

    // Clear errors
    elements.heightError.textContent = '';
    elements.weightError.textContent = '';
    elements.heightInput.classList.remove('error');
    elements.weightInput.classList.remove('error');

    // Hide results
    elements.resultsSection.classList.add('hidden');

    // Reset progress marker
    elements.progressMarker.style.left = '0%';

    // Focus on first input
    elements.heightInput.focus();
  }

  /* ===================================
     SWITCH UNITS
     =================================== */
  function switchUnit(unit) {
    if (unit === currentUnit) return;

    currentUnit = unit;

    // Update active state
    elements.unitBtns.forEach(btn => {
      if (btn.dataset.unit === unit) {
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-checked', 'false');
      }
    });

    // Update unit labels
    if (unit === 'metric') {
      elements.heightUnit.textContent = 'cm';
      elements.weightUnit.textContent = 'kg';
      elements.heightInput.placeholder = '170';
      elements.weightInput.placeholder = '70';
    } else {
      elements.heightUnit.textContent = 'in';
      elements.weightUnit.textContent = 'lbs';
      elements.heightInput.placeholder = '67';
      elements.weightInput.placeholder = '154';
    }

    // Convert existing values if present
    const heightValue = parseFloat(elements.heightInput.value);
    const weightValue = parseFloat(elements.weightInput.value);

    if (!isNaN(heightValue) && heightValue > 0) {
      if (unit === 'metric') {
        // Convert inches to cm
        elements.heightInput.value = (heightValue * 2.54).toFixed(1);
      } else {
        // Convert cm to inches
        elements.heightInput.value = (heightValue / 2.54).toFixed(1);
      }
    }

    if (!isNaN(weightValue) && weightValue > 0) {
      if (unit === 'metric') {
        // Convert lbs to kg
        elements.weightInput.value = (weightValue * 0.453592).toFixed(1);
      } else {
        // Convert kg to lbs
        elements.weightInput.value = (weightValue / 0.453592).toFixed(1);
      }
    }

    // Clear errors
    elements.heightError.textContent = '';
    elements.weightError.textContent = '';
    elements.heightInput.classList.remove('error');
    elements.weightInput.classList.remove('error');

    // Hide results if showing
    elements.resultsSection.classList.add('hidden');
  }

  /* ===================================
     FAQ ACCORDION
     =================================== */
  function initFAQ() {
    elements.faqQuestions.forEach(question => {
      question.addEventListener('click', function () {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';

        // Close all other FAQs
        elements.faqQuestions.forEach(q => {
          q.setAttribute('aria-expanded', 'false');
        });

        // Toggle current FAQ
        this.setAttribute('aria-expanded', !isExpanded);
      });
    });
  }

  /* ===================================
     ANIMATE STATS ON LOAD
     =================================== */
  function animateStats() {
    elements.statValues.forEach(stat => {
      const target = parseInt(stat.dataset.count);
      animateValue(stat, 0, target, 2000);
    });
  }

  /* ===================================
     REAL-TIME INPUT VALIDATION
     =================================== */
  function initRealTimeValidation() {
    elements.heightInput.addEventListener('blur', function () {
      if (this.value) {
        validateInput(this, elements.heightError);
      }
    });

    elements.weightInput.addEventListener('blur', function () {
      if (this.value) {
        validateInput(this, elements.weightError);
      }
    });

    // Clear error on input
    elements.heightInput.addEventListener('input', function () {
      if (elements.heightError.textContent) {
        elements.heightError.textContent = '';
        this.classList.remove('error');
      }
    });

    elements.weightInput.addEventListener('input', function () {
      if (elements.weightError.textContent) {
        elements.weightError.textContent = '';
        this.classList.remove('error');
      }
    });
  }

  /* ===================================
     EVENT LISTENERS
     =================================== */
  function initEventListeners() {
    // Form submission
    elements.form.addEventListener('submit', handleFormSubmit);

    // Reset button
    elements.resetBtn.addEventListener('click', resetCalculator);

    // Unit toggle buttons
    elements.unitBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        switchUnit(this.dataset.unit);
      });
    });

    // Keyboard accessibility for unit toggle
    elements.unitBtns.forEach(btn => {
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          switchUnit(this.dataset.unit);
        }
      });
    });

    // Allow Enter key to submit from inputs
    elements.heightInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        elements.weightInput.focus();
      }
    });

    elements.weightInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleFormSubmit(e);
      }
    });
  }

  /* ===================================
     INITIALIZATION
     =================================== */
  function init() {
    // Initialize event listeners
    initEventListeners();

    // Initialize FAQ accordion
    initFAQ();

    // Initialize real-time validation
    initRealTimeValidation();

    // Animate hero stats
    animateStats();

    // Set initial focus
    elements.heightInput.focus();

    console.log('BMI Calculator initialized successfully! 🎉');
  }

  /* ===================================
     RUN ON DOM READY
     =================================== */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

/* ===================================
   END OF SCRIPT
   =================================== */