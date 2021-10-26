import "alpinejs";
import confetti from 'canvas-confetti';

const fireworks = () =>
  confetti.create(document.getElementById('canvas'), {

  })({ particleCount: 100, spread: 100 });

document.getElementById('button').addEventListener('click', () => {
  console.log('button press');
  fireworks();
}); 