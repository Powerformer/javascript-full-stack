const a = [1, 2, 3, 4];
const domA = document.createElement('div');
const domP = document.createElement('p');
domP.innerHTML = String([...a]);
domA.appendChild(domP);
document.body.appendChild(domA);