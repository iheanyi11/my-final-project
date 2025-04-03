// UI Module: Manages UI interactions and components
export class UIModule {
    constructor() {
        this.errorTimeout = null;
    }
    
    // Show an element by ID
    showElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove('hidden');
        }
    }
    
    // Hide an element by ID
    hideElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('hidden');
        }
    }
    
    // Toggle element visibility
    toggleElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.toggle('hidden');
        }
    }
    
    // Show error message
    showError(message, duration = 5000) {
        // Clear any existing error timeout
        if (this.errorTimeout) {
            clearTimeout(this.errorTimeout);
        }
        
        // Check if error container exists, if not create it
        let errorContainer = document.getElementById('errorContainer');
        if (!errorContainer) {
            errorContainer = document.createElement('div');
            errorContainer.id = 'errorContainer';
            errorContainer.className = 'error-container';
            document.body.appendChild(errorContainer);
        }
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.className = 'error-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', () => {
            errorContainer.removeChild(errorElement);
        });
        
        // Append elements
        errorElement.appendChild(closeButton);
        errorContainer.appendChild(errorElement);
        
        // Auto-remove after duration
        this.errorTimeout = setTimeout(() => {
            if (errorElement.parentNode === errorContainer) {
                errorContainer.removeChild(errorElement);
            }
        }, duration);
    }
    
    // Show success message
    showSuccess(message, duration = 3000) {
        // Check if success container exists, if not create it
        let successContainer = document.getElementById('successContainer');
        if (!successContainer) {
            successContainer = document.createElement('div');
            successContainer.id = 'successContainer';
            successContainer.className = 'success-container';
            document.body.appendChild(successContainer);
        }
        
        // Create success message element
        const successElement = document.createElement('div');
        successElement.className = 'success-message';
        successElement.textContent = message;
        
        // Append element
        successContainer.appendChild(successElement);
        
        // Auto-remove after duration
        setTimeout(() => {
            if (successElement.parentNode === successContainer) {
                successContainer.removeChild(successElement);
            }
        }, duration);
    }
    
    // Create a modal
    createModal(title, content, actions) {
        // Create modal container
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        
        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal-container';
        
        // Create modal header
        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';
        
        const modalTitle = document.createElement('h3');
        modalTitle.textContent = title;
        
        const closeButton = document.createElement('button');
        closeButton.className = 'modal-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modalOverlay);
        });
        
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        if (typeof content === 'string') {
            modalContent.innerHTML = content;
        } else {
            modalContent.appendChild(content);
        }
        
        // Create modal actions
        const modalActions = document.createElement('div');
        modalActions.className = 'modal-actions';
        
        if (actions && actions.length) {
            actions.forEach(action => {
                const button = document.createElement('button');
                button.className = `btn ${action.class || ''}`;
                button.textContent = action.text;
                button.addEventListener('click', () => {
                    if (action.handler) {
                        action.handler();
                    }
                    if (action.closeModal !== false) {
                        document.body.removeChild(modalOverlay);
                    }
                });
                modalActions.appendChild(button);
            });
        }
        
        // Assemble modal
        modalContainer.appendChild(modalHeader);
        modalContainer.appendChild(modalContent);
        modalContainer.appendChild(modalActions);
        modalOverlay.appendChild(modalContainer);
        
        // Add to DOM
        document.body.appendChild(modalOverlay);
        
        // Return methods to control the modal
        return {
            close: () => {
                if (modalOverlay.parentNode === document.body) {
                    document.body.removeChild(modalOverlay);
                }
            },
            updateContent: (newContent) => {
                modalContent.innerHTML = '';
                if (typeof newContent === 'string') {
                    modalContent.innerHTML = newContent;
                } else {
                    modalContent.appendChild(newContent);
                }
            }
        };
    }
    
    // Create a form element
    createForm(fields, submitHandler) {
        const form = document.createElement('form');
        
        fields.forEach(field => {
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';
            
            // Create label
            if (field.label) {
                const label = document.createElement('label');
                label.setAttribute('for', field.id);
                label.textContent = field.label;
                formGroup.appendChild(label);
            }
            
            // Create input
            let input;
            if (field.type === 'textarea') {
                input = document.createElement('textarea');
            } else if (field.type === 'select') {
                input = document.createElement('select');
                
                // Add options
                if (field.options && field.options.length) {
                    field.options.forEach(option => {
                        const optionElement = document.createElement('option');
                        optionElement.value = option.value;
                        optionElement.textContent = option.text;
                        if (option.selected) {
                            optionElement.selected = true;
                        }
                        input.appendChild(optionElement);
                    });
                }
            } else {
                input = document.createElement('input');
                input.type = field.type || 'text';
            }
            
            // Set common properties
            input.id = field.id;
            input.name = field.name || field.id;
            
            if (field.placeholder) {
                input.placeholder = field.placeholder;
            }
            
            if (field.required) {
                input.required = true;
            }
            
            if (field.value !== undefined) {
                input.value = field.value;
            }
            
            if (field.min !== undefined) {
                input.min = field.min;
            }
            
            if (field.max !== undefined) {
                input.max = field.max;
            }
            
            if (field.step !== undefined) {
                input.step = field.step;
            }
            
            // Add any additional attributes
            if (field.attributes) {
                Object.keys(field.attributes).forEach(attr => {
                    input.setAttribute(attr, field.attributes[attr]);
                });
            }
            
            // Add event listeners
            if (field.eventListeners) {
                Object.keys(field.eventListeners).forEach(event => {
                    input.addEventListener(event, field.eventListeners[event]);
                });
            }
            
            formGroup.appendChild(input);
            
            // Add help text if any
            if (field.helpText) {
                const helpText = document.createElement('small');
                helpText.className = 'help-text';
                helpText.textContent = field.helpText;
                formGroup.appendChild(helpText);
            }
            
            form.appendChild(formGroup);
        });
        
        // Add submit button
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.className = 'btn btn-primary btn-block';
        submitButton.textContent = 'Submit';
        form.appendChild(submitButton);
        
        // Add submit handler
        if (submitHandler) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Collect form data
                const formData = {};
                fields.forEach(field => {
                    formData[field.id] = document.getElementById(field.id).value;
                });
                
                submitHandler(formData);
            });
        }
        
        return form;
    }
}