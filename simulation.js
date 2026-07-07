const reactantsLabel = document.getElementById("reactants");
const productsLabel = document.getElementById("products");
const slider = document.getElementById("kslider");
const kValueLabel = document.getElementById("kValue");
const canvas = document.getElementById("simulationCanvas");
const ctx = canvas.getContext("2d");
const particles = [];


reactantsLabel.textContent = "Reactants = 25";
productsLabel.textContent = "Products = 25";
let countReactants = 25;
let countProducts = 25;

slider.addEventListener("input", function () {

    console.log(slider.value);
    if (slider.value > 1) {
        kValueLabel.textContent = "Right"
    } else if (slider.value < 1) {
        kValueLabel.textContent = "Left"
    } else {
        kValueLabel.textContent = "Center"
    }

});

for (let i = 0; i < 25; i++) {
    particles.push({
        x: Math.random() * 800,
        y: Math.random() * 300,

        vx: Math.random() * 8 - 4,
        vy: Math.random() * 8 - 4,

        type: "reactant",
        cooldown: 0,
    });
}
for (let i = 0; i < 25; i++) {
    particles.push({
        x: Math.random() * 800,
        y: Math.random() * 300,

        vx: Math.random() * 8 - 4,
        vy: Math.random() * 8 - 4,

        type: "product",
        cooldown: 0,
    });
}
function drawParticles() {
    ctx.clearRect(0,0,800,300);
    for (const particle of particles) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = 
            particle.type === "reactant" ? "blue" : "red";
        ctx.fill();
    }
}
function moveParticles() {
    for (const particle of particles){
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 8) {
            particle.x = 8;
            particle.vx *= -1;
        };
        if (particle.x > 792) {
            particle.x = 792;
            particle.vx *= -1;
        };
        if (particle.y < 8) {
            particle.y = 8;
            particle.vy *= -1;
        }
        if (particle.y > 292) {
            particle.y = 292;
            particle.vy *= -1;
        }
    }
}

function isTouching(particle1, particle2) {
    const dx = particle1.x - particle2.x;
    const dy = particle1.y - particle2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return {
        touching: distance < 8,
        dx,
        dy,
        distance,
    }
}

function handleCollision(p1, p2, forwardRate, reverseRate) {
            //Check cooldown
                if (p1.cooldown > 0 || p2.cooldown > 0) {
                    return;
                }
                p1.cooldown = 2;
                p2.cooldown = 2;
            //Check relative velocity
                let dvx = p1.vx - p2.vx;
                let dvy = p1.vy - p2.vy;
                let dx = p1.x - p2.x;
                let dy = p1.y - p2.y;
                const relVelocity = dvx * dx + dvy * dy;

                if (relVelocity >= 0) {
                    return;
                }
            //Bounce

                const tempVx = p1.vx;
                p1.vx = p2.vx;
                p2.vx = tempVx;
                const tempVy = p1.vy;
                p1.vy = p2.vy;
                p2.vy = tempVy;

            //Reaction
            if (p1.type === "reactant" && p2.type === "reactant") {
                if (Math.random() < forwardRate){
                    p1.type = "product";
                    p2.type = "product";
                }
            }
            if (p1.type === "product" && p2.type === "product") {
                if (Math.random() < reverseRate){
                    p1.type = "reactant";
                    p2.type = "reactant";
                }   
            }
        }

function simulationStep() {
    const k=Number(slider.value);
    moveParticles();
    const shift = Number(slider.value);

    let forwardRate = 0.1;
    let reverseRate = 0.1;

    if (shift > 0) {
    forwardRate *= (1 + shift);
    }

    if (shift < 0) {
    reverseRate *= (1 + Math.abs(shift));
    }
    
    for (const particle of particles) {
        if (particle.cooldown > 0) {
            particle.cooldown -= 1;
        }
    }
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            const collision = isTouching(p1,p2);
            if (collision.touching){
                handleCollision(p1, p2, forwardRate, reverseRate);
            }
        }
    }
    countReactants = particles.filter(p => p.type === "reactant").length;
    countProducts = particles.filter(p => p.type === "product").length;
    reactantsLabel.textContent = `Reactants = ${countReactants}`;
    productsLabel.textContent = `Products = ${countProducts}`;
    drawParticles();

    requestAnimationFrame(simulationStep);
}

simulationStep();