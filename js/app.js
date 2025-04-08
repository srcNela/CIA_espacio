let currentData;

// Initialize application
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('frameworks.json');
        currentData = await response.json();
        generateViews(currentData);
        setupNavigation();
    } catch (error) {
        console.error('Error loading data:', error);
    }
});

function generateViews(data) {
    generateInfoView(data);
    generateLogicView(data);
    generateSimulationView(data);
}

// Info View Generation
function generateInfoView(data) {
    const container = document.getElementById('infoView');
    // ... previous info view code ...
}

// Build Logic View Generation
function generateLogicView(data) {
    const container = document.getElementById('logicView');
    // ... previous build logic code ...
}

// Simulation View Generation
function generateSimulationView(data) {
    const container = document.getElementById('simulateView');
    container.innerHTML = '';
    
    data.frameworks.forEach(framework => {
        if (!framework.simulations) return;
        
        const card = document.createElement('div');
        card.className = 'simulation-card';
        card.innerHTML = `
            <div class="simulation-header">
                <h2>${framework.name}</h2>
                <span class="category">${framework.category}</span>
            </div>
        `;

        framework.simulations.forEach((sim, index) => {
            const simSection = document.createElement('div');
            simSection.className = 'simulation-section';
            simSection.innerHTML = `
                <h3>Simulation #${index + 1}: ${sim.type.replace(/_/g, ' ').toUpperCase()}</h3>
                <div class="param-group"></div>
                <button class="simulate-btn">Run ${sim.type} Simulation</button>
                <div class="simulation-output"></div>
            `;

            const paramGroup = simSection.querySelector('.param-group');
            sim.parameters.forEach(param => {
                paramGroup.innerHTML += `
                    <div class="param">
                        <label>${param.label}</label>
                        <input class="param-input" 
                               type="${param.type}" 
                               data-param="${param.name}" 
                               value="${param.default}" 
                               min="${param.min || ''}" 
                               max="${param.max || ''}">
                    </div>
                `;
            });

            const btn = simSection.querySelector('.simulate-btn');
            const output = simSection.querySelector('.simulation-output');
            
            btn.addEventListener('click', () => {
                const inputs = {};
                let valid = true;
                
                simSection.querySelectorAll('.param-input').forEach(input => {
                    const value = parseFloat(input.value);
                    if (isNaN(value)) valid = false;
                    inputs[input.dataset.param] = value;
                });

                if (!valid) {
                    output.textContent = 'Error: Please enter valid numbers in all fields';
                    return;
                }

                try {
                    const algorithm = new Function('inputs', sim.algorithm);
                    const result = algorithm(inputs);
                    output.textContent = result;
                } catch (e) {
                    output.textContent = `Simulation Error: ${e.message}`;
                }
            });

            card.appendChild(simSection);
        });
        
        container.appendChild(card);
    });
}

// Navigation Controller
function setupNavigation() {
    const views = {
        info: document.getElementById('infoView'),
        logic: document.getElementById('logicView'),
        simulate: document.getElementById('simulateView')
    };

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active states
            document.querySelectorAll('.nav-btn, .content-view').forEach(el => {
                el.classList.remove('active');
            });
            
            // Set new active
            const viewId = btn.dataset.view;
            btn.classList.add('active');
            views[viewId].classList.add('active');
        });
    });
          }
