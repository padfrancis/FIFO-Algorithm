function toggleMode() {
  const body = document.body;
  const btn = document.getElementById('modeBtn');
  body.classList.toggle('dark');
  if (body.classList.contains('dark')) {
    btn.textContent = "☀️ Light Mode";
    btn.classList.remove('light');
  } else {
    btn.textContent = "🌙 Dark Mode";
    btn.classList.add('light');
  }
}
function simulateFIFO() {
  const memSize = parseInt(document.getElementById('memSize').value);
  let refString = document.getElementById('refString').value.trim().toUpperCase().replace(/\s+/g, '');
  if (!memSize || !refString) {
    document.getElementById('result').innerHTML = "<p style='color:#ff4b5c;text-align:center;'>Please enter both memory size and reference string.</p>";
    document.getElementById('faults').innerHTML = '';
    return;
  }
  refString = refString.replace(/[^A-Z0-9]/g, '');
  const refArr = refString.split('');
  let memory = [];
  let pointer = 0;
  let tableRows = Array.from({length: memSize}, () => []);
  let loadedCell = Array.from({length: memSize}, () => Array(refArr.length).fill(false));
  let hitCell = Array.from({length: memSize}, () => Array(refArr.length).fill(false));
  let pageFaults = 0;
  let pageHits = 0;

  for (let i = 0; i < refArr.length; i++) {
    const page = refArr[i];
    let loadedRow = -1;
    let hitRow = -1;

    if (memory.includes(page)) {
      // Page hit: all cells empty, but mark which memory row is the hit
      for (let j = 0; j < memSize; j++) {
        tableRows[j][i] = '';
        loadedCell[j][i] = false;
        hitCell[j][i] = false;
        if (memory[j] === page) {
          hitRow = j;
        }
      }
      if (hitRow !== -1) hitCell[hitRow][i] = true;
      pageHits++;
    } else {
      // Page fault: show letter in cell, nothing in hitCell
      pageFaults++;
      if (memory.length < memSize) {
        memory.push(page);
        loadedRow = memory.length - 1;
      } else {
        loadedRow = pointer;
        memory[pointer] = page;
        pointer = (pointer + 1) % memSize;
      }
      for (let j = 0; j < memSize; j++) {
        tableRows[j][i] = '';
        loadedCell[j][i] = false;
        hitCell[j][i] = false;
      }
      tableRows[loadedRow][i] = page;
      loadedCell[loadedRow][i] = true;
    }
  }

  // Build table
let html = `
  <div>
    <div style="font-size:1.1rem;margin-bottom:8px;text-align:left;">
      <b>Page Fault:</b> <span style="border-bottom:2px solid #000;padding:0 10px;">${pageFaults}</span>
      &nbsp;&nbsp;
      <b>Page Hit:</b> <span style="border-bottom:2px solid #000;padding:0 10px;">${pageHits}</span>
    </div>
    <table style="width:auto;table-layout:auto;">
      <tr>
        <th class="mem-header">Memory Page</th>
        ${refArr.map(c => `<th>${c}</th>`).join('')}
      </tr>
`;

  for (let row = 0; row < memSize; row++) {
    html += `<tr><td class="row-label">${row + 1}</td>`;
    for (let col = 0; col < refArr.length; col++) {
      let val = tableRows[row][col] || '';
      let cellClass = "mem-cell";
      if (loadedCell[row][col] && val) {
        // Page fault: show letter
        html += `<td class="${cellClass}"><span style="color:#a259e6;font-weight:bold;font-style:italic;">${val}</span></td>`;
      } else if (hitCell[row][col]) {
        // Page hit: show asterisk
        html += `<td class="${cellClass}"><span class="star">*</span></td>`;
      } else {
        html += `<td class="${cellClass}"></td>`;
      }
    }
    html += '</tr>';
  }
  html += '</table>';

  document.getElementById('result').innerHTML = html;
  document.getElementById('faults').innerHTML = '';
}

function resetAll() {
  document.getElementById('memSize').value = 3;
  document.getElementById('refString').value = '';
  document.getElementById('result').innerHTML = '';
  document.getElementById('faults').innerHTML = '';
}