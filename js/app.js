
// Initialize application
window.addEventListener('DOMContentLoaded', () => {
  generateViews(frameworksData);
  setupNavigation();
});

function generateViews(data) {
  generateInfoView(data);
  generateLogicView(data);
  generateSimulationView(data);
}

function generateInfoView(data) {
  const container = document.getElementById('infoView');
  container.innerHTML = '';
  
  const categories = {};
  data.frameworks.forEach(fw => {
    if (!categories[fw.category]) categories[fw.category] = [];
    categories[fw.category].push(fw);
  });

  for (const [category, items] of Object.entries(categories)) {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'category';
    categoryDiv.innerHTML = `<h3>${category}</h3>`;
    
    const list = document.createElement('div');
    list.className = 'framework-items';
    
    items.forEach(item => {
      list.innerHTML += `
        <div class="framework">
          <div class="framework-header">
            <span class="name">${item.name}</span>
            <span class="language">${item.language}</span>
          </div>
          <div class="purpose">${item.purpose}</div>
          <div class="website">
            <a href="${item.website}" target="_blank">Documentation</a>
          </div>
        </div>
      `;
    });
    
    categoryDiv.appendChild(list);
    container.appendChild(categoryDiv);
  }
}

function generateLogicView(data) {
  const container = document.getElementById('logicView');
  container.innerHTML = '';
  
  data.frameworks.forEach(fw => {
    const item = document.createElement('div');
    item.className = 'logic-item';
    item.innerHTML = `
      <div class="logic-header">
        <h3>${fw.name}</h3>
        <span class="category">${fw.category}</span>
      </div>
      <div class="architecture-logic">${fw.logic}</div>
    `;
    container.appendChild(item);
  });
}

function generateSimulationView(data) {
  const container = document.getElementById('simulateView');
  container.innerHTML = '';
  
  data.frameworks.forEach(fw => {
    if (!fw.simulations?.length) return;
    
    const card = document.createElement('div');
    card.className = 'simulation-card';
    card.innerHTML = `
      <div class="simulation-header">
        <h3>${fw.name} Simulations</h3>
        <span class="category">${fw.category}</span>
      </div>
    `;

    fw.simulations.forEach(sim => {
      const simSection = document.createElement('div');
      simSection.className = 'simulation-section';
      simSection.innerHTML = `
        <h4>${sim.type.replace(/_/g, ' ').toUpperCase()}</h4>
        <div class="param-group"></div>
        <button class="simulate-btn">Run Simulation</button>
        <div class="simulation-output"></div>
      `;

      const paramGroup = simSection.querySelector('.param-group');
      sim.parameters.forEach(param => {
        paramGroup.innerHTML += `
          <div class="param">
            <label>${param.label}</label>
            <input class="param-input" type="${param.type}" 
                   data-param="${param.name}" 
                   value="${param.default}">
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
          output.textContent = 'Invalid input values';
          return;
        }

        try {
          const algorithm = new Function('inputs', sim.algorithm);
          const result = algorithm(inputs);
          output.textContent = result;
        } catch(e) {
          output.textContent = `Error: ${e.message}`;
        }
      });

      card.appendChild(simSection);
    });
    
    container.appendChild(card);
  });
}

function setupNavigation() {
  const views = {
    info: document.getElementById('infoView'),
    logic: document.getElementById('logicView'),
    simulate: document.getElementById('simulateView')
  };

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn, .content-view').forEach(el => {
        el.classList.remove('active');
      });
      
      const viewId = btn.dataset.view;
      btn.classList.add('active');
      views[viewId].classList.add('active');
    });
  });
